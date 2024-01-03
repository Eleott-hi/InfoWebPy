from typing import Type, Generic, List, TypeVar
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi.testclient import TestClient
from fastapi import FastAPI
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel

class ItemCreate(BaseModel):
    name: str
    description: str

class ItemResponse(ItemCreate):
    id: int

class UserCreate(BaseModel):
    username: str
    email: str

class UserResponse(UserCreate):
    id: int

app = FastAPI()
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    email = Column(String, index=True)

Base.metadata.create_all(bind=engine)

# Define a generic CRUD router
TypeVarT = TypeVar('TypeVarT')

class CRUDRouter(Generic[TypeVarT]):
    def __init__(self, model: Type[TypeVarT], prefix: str = "/items"):
        self.router = APIRouter(prefix=prefix, tags=[prefix])
        self.model = model

        @self.router.get("/", response_model=List[ItemResponse])  # Use ItemResponse for response serialization
        def read_all(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
            return db.query(self.model).offset(skip).limit(limit).all()

        @self.router.get("/{item_id}", response_model=ItemResponse)  # Use ItemResponse for response serialization
        def read_one(item_id: int, db: Session = Depends(get_db)):
            return db.query(self.model).filter(self.model.id == item_id).first()

        @self.router.post("/", response_model=ItemResponse)  # Use ItemResponse for response serialization
        def create_item(item: ItemCreate, db: Session = Depends(get_db)):
            db_item = self.model(**item.dict())
            db.add(db_item)
            db.commit()
            db.refresh(db_item)
            return db_item

        @self.router.put("/{item_id}", response_model=ItemResponse)  # Use ItemResponse for response serialization
        def update_item(item_id: int, updated_item: ItemCreate, db: Session = Depends(get_db)):
            item = db.query(self.model).filter(self.model.id == item_id).first()
            if item is None:
                raise HTTPException(status_code=404, detail=f"{self.model.__name__} not found")
            for key, value in updated_item.dict().items():
                setattr(item, key, value)
            db.commit()
            db.refresh(item)
            return item

        @self.router.delete("/{item_id}", response_model=dict)
        def delete_item(item_id: int, db: Session = Depends(get_db)):
            item = db.query(self.model).filter(self.model.id == item_id).first()
            if item is None:
                raise HTTPException(status_code=404, detail=f"{self.model.__name__} not found")
            db.delete(item)
            db.commit()
            return {"message": f"{self.model.__name__} deleted successfully"}

item_router = CRUDRouter(Item, prefix="/items")
user_router = CRUDRouter(User, prefix="/users")

def create_test_items():
    db = SessionLocal()

    item1 = Item(name="Item 1", description="Description 1")
    item2 = Item(name="Item 2", description="Description 2")

    db.add(item1)
    db.add(item2)
    db.commit()

    db.close()

create_test_items()

app.include_router(item_router.router)
app.include_router(user_router.router)

