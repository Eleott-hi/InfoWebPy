import re
from sqlalchemy import text
# from ORM.Database import  get_db

# HARDCODED

def get_function_readable_list():
    readable_function_names = [
        "human readable transferred points",
        "human readable xp earned",
        "peers not leaving during the day",
        "percentage of successful checks",
        "points change",
        "points change using hr-source",
        "most checked task daily",
        "last p2p duration",
        "who and when completed the block",
        "recommended for check",
        "two blocks stats",
        "most friendly peers",
        "peers passed check on birthday",
        "peers total xp",
        "peers did 1 and 2 tasks but not 3",
        "number of previous tasks",
        "very lucky days",
        "peer completed max tasks",
        "peer with max xp",
        "peer max time in campus today",
        "peers came early N times",
        "peers left M times last N days",
        "peer came last today",
        "peer left for N minutes yesterday",
        "early visits for each month",
    ]

    return readable_function_names


def get_function_list(engine):

    conn = engine.connect()

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
