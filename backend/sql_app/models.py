# sql_app/models.py

from sqlalchemy import Column, Integer, String, ForeignKey, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    resumes = relationship("Resume", back_populates="owner")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    file_name = Column(String, nullable=False)
    upload_date = Column(DateTime, default=datetime.utcnow)
    extracted_text = Column(Text, nullable=True) # Store the raw text extracted from PDF
    is_verified = Column(Boolean, default=False)

    owner = relationship("User", back_populates="resumes")
    skills = relationship("Skill", back_populates="resume", cascade="all, delete-orphan")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False)
    skill_name = Column(String, index=True, nullable=False)
    source = Column(String, nullable=True) # e.g., "Resume Text", "GitHub API"
    is_verified = Column(Boolean, default=False)
    verification_score = Column(Integer, nullable=True) # e.g., 0-100

    resume = relationship("Resume", back_populates="skills")

# Note: Additional models for GitHub integration, verification algorithms, etc.,
# will be added as the project evolves.
