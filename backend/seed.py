import asyncio
import os

from dotenv import load_dotenv

from database import close_db, init_db
from models.user import User
from security import get_password_hash

load_dotenv()


async def main() -> None:
    await init_db()
    email = os.getenv("SEED_ADMIN_EMAIL", "admin@example.com")
    username = os.getenv("SEED_ADMIN_USERNAME", "admin")
    password = os.getenv("SEED_ADMIN_PASSWORD", "AdminPass123!")

    existing = await User.find_one(User.email == email)
    if existing:
        print(f"Admin already exists: {email}")
    else:
        user = User(
            email=email,
            username=username,
            hashed_password=get_password_hash(password),
            role="admin",
        )
        await user.insert()
        print(f"Created admin user: {email} / {password}")
    await close_db()


if __name__ == "__main__":
    asyncio.run(main())
