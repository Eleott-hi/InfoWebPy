from fastapi import FastAPI
from CRUDRouter import CRUDRouter

from DBModels import (
    Peer,
    Task,
    Check,
    P2P,
    Verter,
    TransferredPoints,
    Friends,
    Recomendation,
    XP,
    TimeTracking,
    get_db,
)

from PydanticModels import (
    PeerCreate, PeerResponse,
    TaskCreate, TaskResponse,
    CheckCreate, CheckResponse,
    P2PCreate, P2PResponse,
    VerterCreate, VerterResponse,
    TransferedPointsCreate, TransferedPointsResponse,
    FriendsCreate, FriendsResponse,
    RecomendationCreate, RecomendationResponse,
    XPCreate, XPResponse,
    TimeTrackingCreate, TimeTrackingResponse,
)


routes_info = [
    (PeerCreate, PeerResponse, Peer, "/peers",),
    (TaskCreate, TaskResponse, Task, "/tasks",),
    (CheckCreate, CheckResponse, Check, "/checks",),
    (P2PCreate, P2PResponse, P2P, "/p2p",),
    (VerterCreate, VerterResponse, Verter, "/verter",),
    (TransferedPointsCreate, TransferedPointsResponse, TransferredPoints, "/points",),
    (FriendsCreate, FriendsResponse, Friends, "/friends",),
    (RecomendationCreate, RecomendationResponse,
     Recomendation, "/recomendations",),
    (XPCreate, XPResponse, XP, "/xp",),
    (TimeTrackingCreate, TimeTrackingResponse, TimeTracking, "/time_tracking",),
]


def LinkRouters(app):
    for create_schema, response_schema, db_model, prefix in routes_info:
        app.include_router(
            CRUDRouter(
                response_schema=response_schema,
                create_schema=create_schema,
                db_model=db_model,
                db=get_db,
                prefix=prefix,
            ).router
        )

app = FastAPI()
LinkRouters(app)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="fastapi", port=8000, reload=True)
