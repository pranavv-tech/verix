from io import BytesIO

from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import pdfplumber

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Verix backend is running"}
@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        return JSONResponse(status_code=400, content={"detail": "Only PDF files are supported"})

    contents = await file.read()

    try:
        with pdfplumber.open(BytesIO(contents)) as pdf:
            text_chunks = [page.extract_text() or "" for page in pdf.pages]
            extracted_text = "\n".join(text_chunks).strip()
    except Exception as exc:
        return JSONResponse(status_code=400, content={"detail": f"Could not read PDF: {exc}"})

    return {"extracted_text": extracted_text}
