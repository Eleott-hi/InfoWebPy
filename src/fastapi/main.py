from fastapi import FastAPI
from CRUDRouter import CRUDRouter
from Models import models, get_db


def LinkRouters(app):
    for model in models:
        app.include_router(
            CRUDRouter(
                response_schema=model["response_model"],
                create_schema=model["create_model"],
                db_model=model["db_model"],
                db=get_db,
                prefix=f'/{model["db_model"]}',
            ).router
        )

app = FastAPI()
LinkRouters(app)


@app.get("/")
async def root():
    return {"tables": [str(model["db_model"]) for model in models]}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="fastapi", port=8000, reload=True)
