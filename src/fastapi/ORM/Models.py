from sqlalchemy import MetaData, Integer, String, DateTime, Time, Date
from pydantic import BaseModel,  create_model, ValidationError, field_validator
from datetime import datetime, time, date
from enum import Enum


def validate_enum(enum_cls, value):
    try:
        # print("validate_enum", enum_cls, value)
        if isinstance(value, str): return enum_cls[value]
        if isinstance(value, int): return enum_cls(value)

        raise ValidationError(
            f'Unhandled instance type for {enum_cls}: {type(value)}'
        )
    except Exception as e:
        raise e


def GetFieldAndValidator(column):
    # print('\t', column.name, column.type, column.nullable, column.primary_key, column.default, column.autoincrement)
    validator = None
    if hasattr(column.type, 'enums') and column.type.enums:
        enum_type = Enum(column.type.name, column.type.enums)
        enum_type.__str__ = lambda self: self.name
        field = (enum_type, ...)
        validator = lambda x: validate_enum(enum_type, x)

    elif isinstance(column.type, Integer):     field = (int, ...)
    elif isinstance(column.type, String):      field = (str, ...)
    elif isinstance(column.type, Time):        field = (time, ...)
    elif isinstance(column.type, DateTime):    field = (datetime, ...)
    elif isinstance(column.type, Date):        field = (date, ...)
    else:           raise Exception(f"Unhandled column type {column.type}")

    if column.nullable:
        field = (field[0] | None, None)

    return field, validator


def GetModels(db_table):
    class DynamicModelBase(BaseModel):
        def __str__(self):
            s = f"{self.__class__.__name__}({dict(self)})"
            return s

    fields_response = {'fields': {}, 'validators': {}}
    fields_create = {'fields': {}, 'validators': {}}

    def add_fields(fields, column_name, field, validator):
        fields['fields'][column_name] = field
        if validator:
            tmp = field_validator(column_name, mode='before')(validator)
            fields['validators'][f"{column_name}_validator"] = tmp

    for column in db_table.c:
        field, validator = GetFieldAndValidator(column)

        add_fields(fields_response, column.name, field, validator)
        if not column.autoincrement:
            add_fields(fields_create, column.name, field, validator)

    return {
        'db_model': db_table,
        'create_model': create_model(
            f'{db_table}_pydantic_create_model',
            **fields_create['fields'],
            __validators__=fields_create['validators'],
            __base__=DynamicModelBase,
        ),
        'response_model': create_model(
            f'{db_table}_pydantic_response_model',
            **fields_response['fields'],
            __validators__=fields_response['validators'],
            __base__=DynamicModelBase,
        ),
    }


def create_pydantic_api_models(engine):
    metadata = MetaData()
    metadata.reflect(engine)
    models = []

    for db_table in metadata.sorted_tables:
        models.append(GetModels(db_table))

    return models


if __name__ == "__main__":
    from Database import get_db, engine

    db = next(get_db())
    
    models = create_pydantic_api_models(engine)

    for model in models:
        result = db.query(model['db_model']).all()
        PydanticModel = model['response_model']

        print(model['db_model'], len(result))

        for row in result:
            # print(row)
            model = PydanticModel(**row._asdict())
            # print(model)
            pass
