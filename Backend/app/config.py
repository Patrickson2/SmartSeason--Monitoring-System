from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str = "sqlite:///./smartseason.db"
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    ADMIN_EMAIL: str = "admin@smartseason.com"
    ADMIN_PASSWORD: str = "Admin123!"
    ADMIN_NAME: str = "SmartSeason Admin"
    ALLOWED_ORIGINS: str = ""


settings = Settings()
