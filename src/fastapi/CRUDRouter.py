from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session


class CRUDRouter():
    def __init__(
        self,
        response_schema,
        create_schema,
        db_model,
        db,
        prefix: str,
    ):

        self.response_schema = response_schema
        self.create_schema = create_schema
        self.db_model = db_model
        self.db = db
        self.router = APIRouter(prefix=prefix)
        self.db_model_pk_field = self.db_model.primary_key.columns[
            0].name if self.db_model.primary_key else None

        @self.router.post("/", response_model=self.response_schema)
        async def create_item(item: self.create_schema, db: Session = Depends(self.db)):

            db_item = self.db_model(**item.dict())
            db.add(db_item)
            db.commit()
            db.refresh(db_item)
            return db_item

        @self.router.get("/", response_model=List[self.response_schema])
        async def read_all(db: Session = Depends(self.db)):
            return db.query(self.db_model).all()

        @self.router.get("/{id}", response_model=self.response_schema)
        async def read_one(id: int | str, db: Session = Depends(self.db)):

            if self.db_model_pk_field is None:
                raise HTTPException(
                    status_code=500,
                    detail="Table without primary key. Unhandled case",
                )

            return db.query(self.db_model).filter(
                self.db_model.c[self.db_model_pk_field] == id
            ).first()

        @self.router.put("/{id}", response_model=self.response_schema)
        async def update_item(id: int | str, updated_item: self.create_schema, db: Session = Depends(self.db)):
            item = await read_one(id, db)

            if item is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"{self.db_model.__name__} not found",
                )

            for key, value in updated_item.dict().items():
                setattr(item, key, value)

            db.commit()
            db.refresh(item)
            return item

        @self.router.delete("/{id}", response_model=dict)
        async def delete_item(id: int | str, db: Session = Depends(self.db)):
            item = await read_one(id, db)

            if item is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"{self.db_model.__name__} not found"
                )

            db.delete(item)
            db.commit()
            return {"message": f"{self.db_model.__name__} deleted successfully"}
