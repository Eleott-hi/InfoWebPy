from sqlalchemy.orm import Session
from sqlalchemy import Table, text
from sqlalchemy import insert, delete, update
from datetime import date
import json


async def get_pk_field(cls: Table):
    if not cls.primary_key:
        raise Exception("Table without primary key. Unhandled case")

    return cls.primary_key.columns[0].name


async def get_all(db: Session, cls: Table):
    return db.query(cls).all()


async def get_columns(db: Session, cls: Table):
    return [column.name for column in cls.columns]


async def get_by_id(db: Session, cls: Table, id: int | str):

    pk = await get_pk_field(cls)
    return db.query(cls).filter(cls.c[pk] == id).first()


async def update_by_id(db: Session, cls: Table, id: int | str, **kwargs):
    pk = await get_pk_field(cls)
    update_query = update(cls).where(cls.c[pk] == id).values(**kwargs).returning(cls)
    result = db.execute(update_query)
    db.commit()

    return result.fetchone()


async def delete_by_id(db: Session, cls: Table, id: int | str):
    pk = await get_pk_field(cls)
    delete_query = delete(cls).where(cls.c[pk] == id)
    db.execute(delete_query)
    db.commit()


async def create(db: Session, cls: Table, **kwargs):
    insert_query = insert(cls).values(**kwargs).returning(cls)
    result = db.execute(insert_query)
    db.commit()

    return result.fetchone()


async def delete_table(db: Session, cls: Table):
    delete_query = delete(cls)
    db.execute(delete_query)
    db.commit()


def default_serializer(obj):
    if isinstance(obj, date):
        return obj.isoformat()
    raise TypeError("Type not serializable")


async def process_row_sql_request(db: Session, request: str):
    result = db.execute(text(request))
    rows = result.fetchall()
    column_names = result.keys()

    res = [dict(zip(column_names, row)) for row in rows]

    return [dict(zip(column_names, row)) for row in rows]


async def __get_type_name(db: Session, type_ids: tuple[str]):
    cache = {}

    def cached_get_type_name(type_id):
        if type_id in cache:
            return cache[type_id]

        query = text("SELECT typname FROM pg_type WHERE oid = :type_id;")

        t_name = db.execute(query, {"type_id": type_id})
        t_name = t_name.fetchone()
        t_name = t_name[0]

        cache[type_id] = t_name

        return t_name

    return [cached_get_type_name(type_id) for type_id in type_ids]

async def __get_function_info(db: Session, f_name: str):

    query = text(
        """
        SELECT
        
        proname, 
        proargmodes, 
        proargnames, 
        proallargtypes 
        
        FROM pg_catalog.pg_proc WHERE proname = :f_name;
        """
    )

    result = db.execute(query, {"f_name": f_name})
    result = result.fetchone()
    types = await __get_type_name(db, result[-1])

    return result[0:-1] + (types,)


async def get_function_info(db: Session, f_name: str):

    params = await __get_function_info(db, f_name)
    vars = list(zip(params[1], params[2], params[3]))

    res = {}
    res["input"] = {var[1]: var[2] for var in vars if var[0] == "i"}
    res["output"] = {var[1]: var[2] for var in vars if var[0] == "t"}

    return res


async def execute_function(db: Session, f_name: str, **kwargs):

    params = [f":{key}" for key in kwargs.keys()]
    params = ", ".join(params)

    sql_query = text(f"SELECT * FROM {f_name}({params})")

    result = db.execute(sql_query, kwargs)
    keys = result.keys()
    response = result.fetchall()

    res = [dict(zip(keys, row)) for row in response]

    return res
