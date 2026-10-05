# backend/api/router.py
"""API router for Verix backend.

Provides endpoints for:
- Uploading a PDF resume (stores metadata in the DB, extracts raw text)
- Extracting skills from the resume text (simple heuristic)
- Verifying a skill against GitHub (searches public repos for the skill name)
"""

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Query
from sqlalchemy.orm import Session
from io import BytesIO
import base64
import binascii
import os
import pdfplumber
import re
import httpx
from dotenv import load_dotenv

from ..sql_app import models
from ..sql_app.database import get_db

router = APIRouter(prefix="/api", tags=["Verix"])

GITHUB_API_URL = "https://api.github.com"
GITHUB_HEADERS = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
}
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract plain text from a PDF using pdfplumber.

    Returns the concatenated text of all pages, stripped of leading/trailing whitespace.
    """
    with pdfplumber.open(BytesIO(file_bytes)) as pdf:
        pages = [page.extract_text() or "" for page in pdf.pages]
    return "\n".join(pages).strip()


def extract_skills_from_text(text: str) -> list[str]:
    """Extract only technologies that actually occur in the resume text."""
    aliases = {
        "python": "Python", "javascript": "JavaScript", "js": "JavaScript",
        "typescript": "TypeScript", "ts": "TypeScript", "react": "React",
        "react.js": "React", "reactjs": "React", "fastapi": "FastAPI",
        "fast api": "FastAPI", "postgresql": "PostgreSQL", "postgres": "PostgreSQL",
        "mysql": "MySQL", "sqlite": "SQLite", "sqlalchemy": "SQLAlchemy",
        "docker": "Docker", "kubernetes": "Kubernetes", "aws": "AWS",
        "azure": "Azure", "gcp": "GCP", "git": "Git", "github": "GitHub",
        "gitlab": "GitLab", "node.js": "Node.js", "nodejs": "Node.js",
        "next.js": "Next.js", "nextjs": "Next.js", "vue.js": "Vue.js",
        "vuejs": "Vue.js", "angular": "Angular", "graphql": "GraphQL",
        "redis": "Redis", "mongodb": "MongoDB", "pytorch": "PyTorch",
        "tensorflow": "TensorFlow", "pandas": "Pandas", "scikit-learn": "scikit-learn",
        "scikit learn": "scikit-learn", "c++": "C++", "c#": "C#",
    }
    normalized_text = re.sub(r"\s+", " ", text.lower())
    found = {
        skill
        for alias, skill in aliases.items()
        if re.search(rf"(?<![a-z0-9+#]){re.escape(alias)}(?![a-z0-9+#])", normalized_text)
    }
    return sorted(found)

async def verify_skill_on_github(skill: str, github_token: str | None = None) -> dict:
    """Search GitHub public code for the given skill name.

    Returns a dict with a simple `score` (0‑100) based on result count.
    """
    query = f"{skill} in:file language:python"  # simple example – refine as needed
    headers = {"Accept": "application/vnd.github+json"}
    if github_token:
        headers["Authorization"] = f"Bearer {github_token}"
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://api.github.com/search/code",
            params={"q": query, "per_page": 1},
            headers=headers,
            timeout=10.0,
        )
        resp.raise_for_status()
        data = resp.json()
        total = data.get("total_count", 0)
        # Map count to a 0‑100 score (log‑scaled to avoid huge numbers)
        import math
        score = min(100, int(math.log1p(total) * 20))
        return {"skill": skill, "github_hits": total, "score": score}


def skill_terms(skill: str) -> list[str]:
    normalized = skill.lower()
    aliases = {
        "javascript": ["javascript", "js"], "typescript": ["typescript", "ts"],
        "react": ["react", "react-dom"], "fastapi": ["fastapi"],
        "postgresql": ["postgresql", "postgres", "psycopg", "asyncpg"],
        "docker": ["docker", "dockerfile", "docker-compose", "compose"],
        "node.js": ["node", "node.js", "express"], "sqlalchemy": ["sqlalchemy"],
    }
    return aliases.get(normalized, [normalized])


async def inspect_repository(client: httpx.AsyncClient, repository: dict) -> list[dict]:
    """Inspect limited, high-signal repository files without crawling source trees."""
    full_name = repository.get("full_name")
    if not isinstance(full_name, str) or not full_name:
        return []
    evidence: list[dict] = []
    try:
        contents = await fetch_github_json(client, f"/repos/{full_name}/contents")
    except HTTPException:
        return evidence
    if not isinstance(contents, list):
        return evidence

    priority = {"readme.md", "package.json", "requirements.txt", "pyproject.toml", "dockerfile", "docker-compose.yml", "compose.yaml"}
    files = [item for item in contents if isinstance(item, dict) and item.get("type") == "file" and str(item.get("name", "")).lower() in priority]
    for item in files[:6]:
        path = item.get("path")
        if not isinstance(path, str):
            continue
        try:
            payload = await fetch_github_json(client, f"/repos/{full_name}/contents/{path}")
        except HTTPException:
            continue
        if not isinstance(payload, dict) or not isinstance(payload.get("content"), str):
            continue
        try:
            content = base64.b64decode(payload["content"]).decode("utf-8", errors="ignore")
        except (ValueError, binascii.Error):
            continue
        evidence.append({"path": path, "content": content[:50000], "url": payload.get("html_url") or f"https://github.com/{full_name}/blob/{repository.get('default_branch', 'main')}/{path}"})
    return evidence


async def verify_resume_skills(client: httpx.AsyncClient, repositories: list[dict], skills: list[str]) -> list[dict]:
    """Score evidence transparently: dependency/configuration 0.85, language 0.35,
    README 0.50, and metadata 0.15; verified is >= 0.75, partial >= 0.30.
    """
    inspected = {repository.get("full_name"): await inspect_repository(client, repository) for repository in repositories}
    results = []
    for skill in skills:
        terms = skill_terms(skill)
        matches: list[dict] = []
        for repository in repositories:
            name_text = f"{repository.get('name', '')} {repository.get('description') or ''} {' '.join(repository.get('topics') or [])}".lower()
            language = str(repository.get("language") or "").lower()
            if any(term in language for term in terms):
                matches.append({"repository": repository.get("name"), "type": "language", "details": f"Repository language is {repository.get('language')}.", "url": repository.get("html_url"), "weight": 0.35})
            if any(term in name_text for term in terms):
                matches.append({"repository": repository.get("name"), "type": "metadata", "details": "Repository metadata mentions this skill.", "url": repository.get("html_url"), "weight": 0.15})

            for file in inspected.get(repository.get("full_name"), []):
                content = file["content"].lower()
                path_name = file["path"].lower()
                is_docker_configuration = skill.lower() == "docker" and path_name in {"dockerfile", "docker-compose.yml", "compose.yaml"}
                if any(term in content for term in terms) or is_docker_configuration:
                    file_type = "dependency" if file["path"].lower() in {"package.json", "requirements.txt", "pyproject.toml"} else "configuration" if "docker" in file["path"].lower() or file["path"].lower() in {"compose.yaml", "docker-compose.yml"} else "readme"
                    weight = 0.85 if file_type in {"dependency", "configuration"} else 0.5
                    matches.append({"repository": repository.get("name"), "type": file_type, "details": f"{skill} appears in {file['path']}.", "url": file["url"], "weight": weight})

        unique_matches = {(match["repository"], match["type"], match["url"]): match for match in matches}
        evidence = list(unique_matches.values())
        score = min(1.0, sum(match.pop("weight") for match in evidence))
        status = "verified" if score >= 0.75 else "partial" if score >= 0.3 else "not_verified"
        results.append({"skill": skill, "status": status, "score": round(score, 2), "evidence": evidence})
    return results


async def fetch_github_json(client: httpx.AsyncClient, path: str, params: dict | None = None) -> dict | list:
    """Fetch a GitHub response and translate upstream failures into API errors."""
    token = os.getenv("GITHUB_TOKEN")
    if not token or token == "YOUR_NEW_GITHUB_TOKEN":
        raise HTTPException(status_code=503, detail="GitHub integration is not configured")

    headers = {**GITHUB_HEADERS, "Authorization": f"Bearer {token}"}
    try:
        response = await client.get(f"{GITHUB_API_URL}{path}", params=params, headers=headers)
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="GitHub request timed out")
    except httpx.RequestError:
        raise HTTPException(status_code=502, detail="Could not connect to GitHub")

    if response.status_code == 404:
        raise HTTPException(status_code=404, detail="GitHub username not found")
    if response.status_code in (401, 403):
        if response.headers.get("X-RateLimit-Remaining") == "0":
            raise HTTPException(status_code=429, detail="GitHub API rate limit exceeded")
        raise HTTPException(status_code=401, detail="GitHub authentication failed")
    if response.status_code >= 500:
        raise HTTPException(status_code=502, detail="GitHub is temporarily unavailable")
    if response.status_code >= 400:
        raise HTTPException(status_code=502, detail="GitHub rejected the request")

    try:
        payload = response.json()
    except ValueError:
        raise HTTPException(status_code=502, detail="GitHub returned an unexpected response")
    if not isinstance(payload, (dict, list)):
        raise HTTPException(status_code=502, detail="GitHub returned an unexpected response")
    return payload


@router.get("/github/{username}")
async def get_github_profile(username: str, skills: list[str] = Query(default=[])):
    """Return public GitHub data and optional resume-skill verification."""
    if not re.fullmatch(r"[A-Za-z0-9-]{1,39}", username):
        raise HTTPException(status_code=400, detail="Invalid GitHub username")

    async with httpx.AsyncClient(timeout=10.0) as client:
        profile = await fetch_github_json(client, f"/users/{username}")
        repositories = await fetch_github_json(
            client,
            f"/users/{username}/repos",
            {"sort": "updated", "direction": "desc", "per_page": 30, "type": "owner"},
        )

    if not isinstance(profile, dict) or not isinstance(repositories, list):
        raise HTTPException(status_code=502, detail="GitHub returned an unexpected response")

    repo_items = []
    languages: set[str] = set()
    for repository in repositories:
        if not isinstance(repository, dict) or repository.get("fork"):
            continue
        language = repository.get("language")
        topics = repository.get("topics") or []
        repo_skills = [topic for topic in topics if isinstance(topic, str)]
        if isinstance(language, str) and language:
            languages.add(language)
            if language not in repo_skills:
                repo_skills.insert(0, language)
        repo_items.append({
            "name": repository.get("name", ""),
            "full_name": repository.get("full_name", ""),
            "html_url": repository.get("html_url", ""),
            "default_branch": repository.get("default_branch", "main"),
            "description": repository.get("description"),
            "language": language or "Unknown",
            "stargazers_count": repository.get("stargazers_count", 0),
            "forks_count": repository.get("forks_count", 0),
            "created_at": repository.get("created_at"),
            "updated_at": repository.get("updated_at"),
            "topics": topics,
            "skills": repo_skills,
            "readme": False,
            "status": "Verified" if repo_skills else "Not Verified",
        })

    normalized_skills = sorted(set(skill.strip() for skill in skills if skill.strip()))
    if normalized_skills:
        async with httpx.AsyncClient(timeout=10.0) as evidence_client:
            verification = await verify_resume_skills(evidence_client, repo_items[:10], normalized_skills)
    else:
        verification = []
    overall_score = round(sum(result["score"] for result in verification) / len(verification), 2) if verification else 0

    return {
        "username": profile.get("login", username),
        "profile": {
            "login": profile.get("login", username),
            "name": profile.get("name"),
            "avatar_url": profile.get("avatar_url"),
            "html_url": profile.get("html_url"),
            "bio": profile.get("bio"),
            "public_repos": profile.get("public_repos", 0),
            "followers": profile.get("followers", 0),
            "following": profile.get("following", 0),
            "created_at": profile.get("created_at"),
        },
        "repositories": repo_items,
        "languages": sorted(languages),
        "total_stars": sum(repo["stargazers_count"] for repo in repo_items),
        "resume_skills": normalized_skills,
        "verification": verification,
        "overall_score": overall_score,
    }

# ---------------------------------------------------------------------------
# Endpoint implementations
# ---------------------------------------------------------------------------

@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Upload a resume PDF, store metadata, extract text and skills.

    The response includes the extracted text, a list of detected skills, and
    verification scores for each skill.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    raw_bytes = await file.read()
    try:
        text = extract_text_from_pdf(raw_bytes)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Could not read PDF: {exc}")

    # Create a dummy user for demo purposes (in a real app you'd have auth)
    user = db.query(models.User).filter_by(username="demo").first()
    if not user:
        user = models.User(username="demo", email="demo@example.com", hashed_password="not_used")
        db.add(user)
        db.commit()
        db.refresh(user)

    resume = models.Resume(
        user_id=user.id,
        file_name=file.filename,
        extracted_text=text,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    # Skill extraction
    skills = extract_skills_from_text(text)
    skill_objs = []
    for skill_name in skills:
        skill_obj = models.Skill(resume_id=resume.id, skill_name=skill_name, source="Resume Text")
        db.add(skill_obj)
        skill_objs.append(skill_obj)
    db.commit()

    return {
        "resume_id": resume.id,
        "extracted_text": text[:500] + ("..." if len(text) > 500 else ""),
        "skills": skills,
    }

# Additional endpoints (e.g., list resumes, get resume details) could be added later.
