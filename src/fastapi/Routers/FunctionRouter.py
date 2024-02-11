from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import ORM.SQLRequests as SQLRequests
from logging_config import get_logger

logger = get_logger(__name__)

class FunctionRouter:
    def __init__(
        self,
        db,
        prefix: str,
    ):

        self.db = db
        self.f_name = prefix.split("/")[-1]
        self.router = APIRouter(prefix=prefix)

        @self.router.get("/", response_model=dict)
        async def get_function_info(db: Session = Depends(self.db)):
            try:
                res = await SQLRequests.get_function_info(db, self.f_name)
                logger.info(res)
                return res

            except Exception as e:
                logger.error(e)
                raise HTTPException(status_code=404, detail=str(e))

        @self.router.post("/execute")
        async def execute_function(params: dict, db: Session = Depends(self.db)):
            try:
                res = await SQLRequests.execute_function(db, self.f_name, **params)
                logger.info(res)
                return res

            except Exception as e:
                logger.error(e)
                raise HTTPException(status_code=404, detail=str(e))
