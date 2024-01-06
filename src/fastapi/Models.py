from sqlalchemy import create_engine,  MetaData, Integer, String, DateTime, Time, Date
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel,  create_model
from datetime import datetime, time, date
from enum import Enum
from copy import deepcopy


DATABASE_URL = "postgresql://postgres:postgres@db:5432/postgres"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_pydantic_api_models(engine):
    class DynamicModelBase(BaseModel):
        def __str__(self):
            return f"{self.__class__.__name__}({dict(self)})"

    metadata = MetaData()
    metadata.reflect(engine)

    models = []

    for db_table in metadata.sorted_tables:

        fields_response = {}
        fields_create = {}

        for column in db_table.c:
            # print('\t', column.name, column.type, column.nullable, column.primary_key, column.default, column.autoincrement)
            if hasattr(column.type, 'enums') and column.type.enums:
                check_status = Enum('check_status', column.type.enums)
                field = (check_status, ...)
            elif isinstance(column.type, Integer):
                field = (int, ...)
            elif isinstance(column.type, String):
                field = (str, ...)
            elif isinstance(column.type, Time):
                field = (time, ...)
            elif isinstance(column.type, DateTime):
                field = (datetime, ...)
            elif isinstance(column.type, Date):
                field = (date, ...)

            if column.nullable:
                field = (field[0] | None, None)

            fields_response[column.name] = field
            if not column.autoincrement:
                fields_create[column.name] = field

        models.append({
            'db_model': db_table,
            'create_model': create_model(
                f'{db_table}_pydantic_create_model',
                **fields_create,
                __base__=DynamicModelBase,
            ),
            'response_model': create_model(
                f'{db_table}_pydantic_response_model',
                **fields_response,
                __base__=DynamicModelBase,
            )
        })

    return models


models = create_pydantic_api_models(engine)


if __name__ == "__main__":

    DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/postgres"
    engine = create_engine(DATABASE_URL)

    models = create_pydantic_api_models(engine)

    for model in models:
        for key, value in model.items():
            if key != 'db_model':
                print(key, value())
