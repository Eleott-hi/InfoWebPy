import re
from sqlalchemy import text
from ORM.Database import engine, get_db


def get_func(f, **kwargs):

    params = ", ".join([":" + key for key in kwargs.keys()])
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


def get_function_list(engine):

    conn = next(get_db())

    sql_query = text(
        "SELECT proname FROM pg_proc WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')"
    )
    result = conn.execute(sql_query)
    funcs = result.fetchall()
    funcs = [name[0] for name in funcs]

    funcs = filter(lambda x: re.match(r"^fnc_\d*$", x) is not None, funcs)
    funcs = list(funcs)
    funcs = sorted(funcs, key=lambda x: int(x.split("_")[1]))

    return funcs


def get_function_params(function_name):

    db = next(get_db())
    query = text(
        "SELECT proname, proargmodes, proargnames, proallargtypes FROM pg_catalog.pg_proc WHERE proname = :function_name"
    )
    result = db.execute(query, {"function_name": function_name})
    result = result.fetchone()
    return result


types_cache = {}


def get_type_name(type_id):

    t_name = types_cache.get(type_id, None)
    if t_name is not None:
        return t_name

    db = next(get_db())

    query = text("SELECT typname FROM pg_type WHERE oid = :type_id;")
    types = db.execute(query, {"type_id": type_id})
    types = types.fetchone()

    t_name = types[0]
    types_cache[type_id] = t_name
    return t_name


# RMKeyView(['oid', 'proname', 'pronamespace', 'proowner',
# 'prolang', 'procost', 'prorows', 'provariadic', 'prosupport',
# 'prokind', 'prosecdef', 'proleakproof', 'proisstrict', 'proretset',
# 'provolatile', 'proparallel', 'pronargs', 'pronargdefaults',
# 'prorettype', 'proargtypes', 'proallargtypes', 'proargmodes',
# 'proargnames', 'proargdefaults', 'protrftypes', 'prosrc', 'probin',
# 'prosqlbody', 'proconfig', 'proacl'])

# (16565,
# 'fnc_7', 16384, 10, 13568, 100.0, 1000.0, 0, '-', 'f', False, False, False, True, 'v', 'u', 0, 0, 2249, '', [1082, 1043], ['t', 't'], ['day', 'task'], None, None, '\nBEGIN\n    RETURN QUERY\n        WITH t1 AS (SELECT "date", checks.task, count(checks.task) AS amount\n                    FROM checks\n            ... (148 characters truncated) ... FROM t1\n        WHERE amount = (SELECT max(t2.amount)\n                        FROM t1 t2\n                        WHERE t1.date = t2.date);\nEND;\n', None, None, None, None)


def get_function_info(db, function_name):
    functions = get_function_list(db)

    params = [get_function_params(f_name) for f_name in functions]
    types = [[get_type_name(_type) for _type in param[-1]] for param in params]
    params = [param[:-1] + (types[i],) for i, param in enumerate(params)]

    res = {}

    for param in params:
        f_name = param[0]
        tmp_dict = {}

        vars = list(zip(param[1], param[2], param[3]))
        print(vars)
        tmp_dict["inputs"] = {var[1]: var[2] for var in vars if var[0] == "i"}
        tmp_dict["outputs"] = {var[1]: var[2] for var in vars if var[0] == "t"}

        res[f_name] = tmp_dict
        
    print("HERE", function_name)

    return res[function_name]


if __name__ == "__main__":
    main()
