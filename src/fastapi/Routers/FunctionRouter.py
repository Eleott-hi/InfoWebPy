from typing import List
from fastapi import APIRouter, Depends, Query, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import insert, delete
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse
import ORM.SQLRequests as SQLRequests
import ORM.Functions as SQLFunctions


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
                return await SQLRequests.get_function_info(db, self.f_name)
            except Exception as e:
                raise HTTPException(status_code=404, detail=str(e))

        @self.router.post("/execute")
        async def execute_function(params: dict, db: Session = Depends(self.db)):
            try:
                return  await SQLRequests.execute_function(db, self.f_name, **params)
            except Exception as e:
                raise HTTPException(status_code=404, detail=str(e))
