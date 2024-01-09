def get_func(f, **kwargs):
    from sqlalchemy import create_engine, text
    from Database import engine, get_db

    params = ', '.join([':' + key for key in kwargs.keys()])
    sql_query = text(f"SELECT * FROM fnc_{f}({params})")
    result = next(get_db()).execute(sql_query, kwargs)

    print(result.keys())
    for row in result.fetchall():
        print(row)

# fnc_22(2, 1)
get_func(8
        #  p2=1,
        #  p1=2,
        #  f1='C3_SimpleBashUtils',
        #  f2='C5_s21_decimal',
        #  f3='D01_Linux'
         # date='2023-01-04',
         # param1='value1',
         # param2='value2',
         )


def get_list():
    from sqlalchemy import create_engine, text
    from Database import engine

    conn = engine.connect()

    sql_query = text(
        "SELECT proname FROM pg_proc WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')")
    result = conn.execute(sql_query)
    function_names = result.fetchall()

    for name in function_names:
        print(name[0])
