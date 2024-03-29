from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import ORM.SQLRequests as SQLRequests

from logging_config import get_logger

logger = get_logger(__name__)


class CRUDRouter:
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

        @self.router.post("/", response_model=self.response_schema)
        async def create_item(item: self.create_schema, db: Session = Depends(self.db)):
            try:
                res = await SQLRequests.create(db, self.db_model, **item.dict())
                logger.info(res)
                return res

            except Exception as e:
                logger.error(e)
                raise HTTPException(status_code=404, detail=str(e))

        @self.router.get("/", response_model=List[self.response_schema])
        async def get_all(db: Session = Depends(self.db)):
            try:
                res = await SQLRequests.get_all(db, self.db_model)
                logger.info(res)
                return res

            except Exception as e:
                logger.error(e)
                raise HTTPException(status_code=404, detail=str(e))

        @self.router.get("/columns", response_model=List[str])
        async def get_columns(db: Session = Depends(self.db)):
            try:
                res = await SQLRequests.get_columns(db, self.db_model)
                logger.info(res)
                return res

            except Exception as e:
                logger.error(e)
                raise HTTPException(status_code=404, detail=str(e))

        @self.router.get("/{id}", response_model=self.response_schema)
        async def get_by_id(id: int | str, db: Session = Depends(self.db)):
            try:
                res = await SQLRequests.get_by_id(db, self.db_model, id)
                logger.info(res)
                return res

            except Exception as e:
                logger.error(e)
                raise HTTPException(status_code=404, detail=str(e))

        @self.router.put("/{id}", response_model=self.response_schema)
        async def update_item(
            id: int | str,
            updated_item: self.create_schema,
            db: Session = Depends(self.db),
        ):
            try:
                res = await SQLRequests.update_by_id(
                    db, self.db_model, id, **updated_item.dict()
                )
                logger.info(res)
                return res

            except Exception as e:
                logger.error(e)
                raise HTTPException(status_code=404, detail=str(e))

        @self.router.delete("/{id}", response_model=dict)
        async def delete_item(id: int | str, db: Session = Depends(self.db)):
            try:
                await SQLRequests.delete_by_id(db, self.db_model, id)
                res = {"message": f"{self.db_model} with id={id} deleted successfully"}
                logger.info(res)
                return res

            except Exception as e:
                logger.error(e)
                raise HTTPException(status_code=404, detail=str(e))

        @self.router.delete("/", response_model=dict)
        async def delete_table(db: Session = Depends(self.db)):
            try:
                await SQLRequests.delete_table(db, self.db_model)
                res = {"message": f"{self.db_model} was deleted successfully"}
                logger.info(res)
                return res

            except Exception as e:
                logger.error(e)
                raise HTTPException(status_code=404, detail=str(e))

        @self.router.post("/import")
        async def import_table(
            table: list[self.create_schema], db: Session = Depends(self.db)
        ):
            try:
                await SQLRequests.delete_table(db, self.db_model)
                for row in table:
                    await SQLRequests.create(db, self.db_model, **row.dict())

                res = {"message": f"{self.db_model} was imported successfully"}
                logger.info(res)
                return res

            except Exception as e:
                logger.error(e)
                return HTTPException(status_code=500, detail=str(e))
