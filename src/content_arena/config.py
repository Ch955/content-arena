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


def chromium_launch_args() -> dict:
    """Use CHROMIUM_PATH, or a preinstalled browser at /opt/pw-browsers/chromium, if Playwright's own isn't installed."""
    path = get("CHROMIUM_PATH")
    if not path:
        for cand in sorted(Path("/opt/pw-browsers").glob("chromium-*/chrome-linux*/chrome")) + [Path("/opt/pw-browsers/chromium")]:
            if cand.is_file():
                path = str(cand)
                break
    return {"executable_path": path} if path else {}
