from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Routers.CRUDRouter import CRUDRouter
from Routers.FunctionRouter import FunctionRouter
from ORM.Models import create_pydantic_api_models
from ORM.Database import get_db, engine
from ORM.Functions import get_function_list
from ORM.SQLRequests import process_row_sql_request

from fastapi import Depends
from sqlalchemy.orm import Session


def LinkModelRouters(app, models):
    for model in models:
        app.include_router(
            CRUDRouter(
                response_schema=model["response_model"],
                create_schema=model["create_model"],
                db_model=model["db_model"],
                db=get_db,
                prefix=f'/tables/{model["db_model"]}',
            ).router
        )


def LinkFunctionRouters(app, funcs):
    for f_name in funcs:
        app.include_router(
            FunctionRouter(
                db=get_db,
                prefix=f"/functions/{f_name}",
            ).router
        )


app = FastAPI()
models = create_pydantic_api_models(engine)
funcs = get_function_list(engine)
LinkModelRouters(app, models)
LinkFunctionRouters(app, funcs)

origins = [
    "http://localhost",
    "http://localhost:3000",  # Add your frontend origin(s)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/tables")
async def tables():
    return {"tables": [str(model["db_model"]) for model in models]}


@app.get("/functions")
async def get_functions():
    return {"functions": [str(f_name) for f_name in funcs]}


# @app.get("/sql-request")
# async def sql_request(request: str):
#     print(request)
#     return {
#         "request": request
#     }


@app.get("/sql-request")
async def sql_request(request: str, db: Session = Depends(get_db)):
    res = await process_row_sql_request(db, request)
    print(res)
    return {"response": res}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="fastapi", port=8000, reload=True)
