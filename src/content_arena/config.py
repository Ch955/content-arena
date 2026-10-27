"""Settings come from environment variables (loaded from .env locally, GitHub secrets in CI)."""
import os
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")


class ConfigError(RuntimeError):
    pass


def get(name: str, default: str | None = None, required: bool = False) -> str | None:
    value = os.environ.get(name, "").strip() or default
    if required and not value:
        # Never echo values — only the missing name.
        raise ConfigError(f"Missing required setting {name}. Add it to .env (see .env.example).")
    return value
