
from sqlalchemy.orm import Session
from sqlalchemy import Table
from sqlalchemy import insert, delete, update


async def get_pk_field(
    cls: Table
):
    if not cls.primary_key:
        raise Exception("Table without primary key. Unhandled case")

    return cls.primary_key.columns[0].name


async def get_all(
    db: Session,
    cls: Table
):
    return db.query(cls).all()


async def get_by_id(
    db: Session,
    cls: Table,
    id: int | str
):

    pk = await get_pk_field(cls)
    return db.query(cls).filter(cls.c[pk] == id).first()


async def update_by_id(
    db: Session,
    cls: Table,
    id: int | str,
    **kwargs
):
    pk = await get_pk_field(cls)
    update_query = update(cls).where(
        cls.c[pk] == id).values(**kwargs).returning(cls)
    result = db.execute(update_query)
    db.commit()

    return result.fetchone()


async def delete_by_id(
    db: Session,
    cls: Table,
    id: int | str
):
    pk = await get_pk_field(cls)
    delete_query = delete(cls).where(cls.c[pk] == id)
    db.execute(delete_query)
    db.commit()


async def create(
    db: Session,
    cls: Table,
    **kwargs
):
    insert_query = insert(cls).values(**kwargs).returning(cls)
    result = db.execute(insert_query)
    db.commit()

    return result.fetchone()

async def delete_table(
    db: Session,
    cls: Table
):
    delete_query = delete(cls)
    db.execute(delete_query)
    db.commit()