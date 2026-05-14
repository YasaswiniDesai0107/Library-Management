# ============================================================
# config/settings.py
# Loads environment variables from .env using pydantic-settings.
# All configuration values are centralized here — no hardcoding!
# ============================================================

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Application-wide settings loaded from the .env file.
    BaseSettings automatically reads values from environment variables.
    """

    # Database connection string for MySQL
    # Format: mysql+pymysql://<user>:<password>@<host>:<port>/<database>
    DATABASE_URL: str

    # FastAPI application metadata
    APP_NAME: str = "Library Management System"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    class Config:
        # Tell pydantic-settings where to find the .env file
        env_file = ".env"
        env_file_encoding = "utf-8"


# Create a single shared instance of Settings.
# Import this `settings` object wherever configuration values are needed.
settings = Settings()
