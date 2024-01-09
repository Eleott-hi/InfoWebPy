from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# HOST = "localhost"
HOST = "db"
PORT = 5432
USER = "postgres"
DB_NAME = "postgres"
PASSWORD = "postgres"

DB_URL = f"postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DB_NAME}"
engine = create_engine(DB_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
