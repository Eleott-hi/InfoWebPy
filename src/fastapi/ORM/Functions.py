
def get_func(f, **kwargs):
    from sqlalchemy import create_engine, text
    from Database import engine, get_db

    params = ', '.join([':' + key for key in kwargs.keys()])
    print(params)
    print()
    sql_query = text(f"SELECT * FROM fnc_{f}({params})")
    result = next(get_db()).execute(sql_query, kwargs)
    keys = result.keys()
    response = result.fetchall()
    
    res = [dict(zip(keys, row)) for row in response]

    return res

# # fnc_22(2, 1)
# get_func(8
#         #  p2=1,
#         #  p1=2,
#         #  f1='C3_SimpleBashUtils',
#         #  f2='C5_s21_decimal',
#         #  f3='D01_Linux'
#          # date='2023-01-04',
#          # param1='value1',
#          # param2='value2',
#          )




def get_list():
    from sqlalchemy import create_engine, text
    from Database import engine

    conn = engine.connect()

    sql_query = text(
        "SELECT proname FROM pg_proc WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')")
    result = conn.execute(sql_query)
    funcs = result.fetchall()
    funcs = [name[0] for name in funcs]
    funcs.sort()

    return funcs

def get_params(func_name):
    from sqlalchemy import create_engine, MetaData
    from Database import engine


    query = f"""
            SELECT 
                pg_attribute.attname
            FROM 
                pg_catalog.pg_attribute
            JOIN 
                pg_catalog.pg_proc ON (pg_attribute.attrelid = pg_proc.oid)
            WHERE 
                pg_proc.proname = '{func_name}'
            AND 
                pg_attribute.attnum > 0
            AND 
                NOT pg_attribute.attisdropped
            """
            
    connection = engine.connect()
    result = connection.execute(query)

    # Extract parameter names from the query result
    params = [row[0] for row in result]

    return params



if __name__ == "__main__":
    functions = get_list()
    # # print (functions)
    # # print()
    result = get_func(1)
    
    for row in result:
        print(row)
    
    # print()
    
    params = get_params(functions[0])
    print(params)