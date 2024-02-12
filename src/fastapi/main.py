from logging_config import get_logger, init_logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Routers.CRUDRouter import CRUDRouter
from Routers.FunctionRouter import FunctionRouter
from ORM.Models import create_pydantic_api_models
from ORM.Database import get_db, engine
from ORM.Functions import get_function_list, get_function_readable_list
from ORM.SQLRequests import process_row_sql_request


from fastapi import Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

init_logging()
logger = get_logger(__name__)


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


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    try:
        res = "Welcome to Info Web api"
        logger.info(res)

        return res

    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/tables")
async def tables():
    try:
        res = {"tables": [str(model["db_model"]) for model in models]}
        logger.info(res)

        return res

    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/functions")
async def get_functions():
    try:
        res = {
            "functions": [str(f_name) for f_name in funcs],
            "readable_names": get_function_readable_list(),
        }

        logger.info(res)
        return res

    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/sql-request")
async def sql_request(request: str, db: Session = Depends(get_db)):
    try:
        res = await process_row_sql_request(db, request)
        logger.info(res)
        return res

    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=404, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="fastapi", port=8000, reload=False)
