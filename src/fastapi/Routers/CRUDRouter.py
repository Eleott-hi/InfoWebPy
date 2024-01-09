from typing import List
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import insert, delete
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse
import ORM.SQLRequests as SQLRequests
import csv


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

        @self.router.post("/", response_model=self.response_schema)
        async def create_item(item: self.create_schema, db: Session = Depends(self.db)):
            try:
                return await SQLRequests.create(db, self.db_model, **item.dict())
            except Exception as e:
                raise HTTPException(status_code=404, detail=str(e))

        @self.router.get("/", response_model=List[self.response_schema])
        async def read_all(db: Session = Depends(self.db)):
            return await SQLRequests.get_all(db, self.db_model)

        @self.router.get("/download")
        async def download(db: Session = Depends(self.db)):
            # result = await read_all(db)
            # csv_file_path = 'tmp/output.csv'

            # with open(csv_file_path, 'w', newline='', encoding='utf-8') as csvfile:
            #     pass
            #     csv_writer = csv.DictWriter(
            #         csvfile,
            #         fieldnames=self.db_model.c.keys()
            #     )

            #     csv_writer.writeheader()

            #     for row in result:
            #         csv_writer.writerow(row._asdict())

            return FileResponse(csv_file_path, filename="output.csv")

        @self.router.post("/upload")
        async def import_csv_to_db(
            file: UploadFile = File(...),
            db: Session = Depends(self.db)
        ):
            try:
                content = await file.read()
                decoded_content = content.decode('utf-8')
                csv_reader = csv.DictReader(decoded_content.splitlines())

                for row in csv_reader:
                    await SQLRequests.create(db, self.db_model, **row)

                return {"message": f"{file.filename} imported successfully"}
                
            except Exception as e:
                return HTTPException(status_code=500, detail=str(e))

        @self.router.get("/{id}", response_model=self.response_schema)
        async def read_one(id: int | str, db: Session = Depends(self.db)):
            return await SQLRequests.get_by_id(db, self.db_model, id)

        @self.router.put("/{id}", response_model=self.response_schema)
        async def update_item(id: int | str, updated_item: self.create_schema, db: Session = Depends(self.db)):
            try:
                return await SQLRequests.update_by_id(db, self.db_model, id, **updated_item.dict())
            except Exception as e:
                raise HTTPException(status_code=404, detail=str(e))

        @self.router.delete("/{id}", response_model=dict)
        async def delete_item(id: int | str, db: Session = Depends(self.db)):
            try:
                await SQLRequests.delete_by_id(db, self.db_model, id)
                return {"message": f"{self.db_model} with id={id} deleted successfully"}
            except Exception as e:
                raise HTTPException(status_code=404, detail=str(e))

