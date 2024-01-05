from pydantic import BaseModel

from datetime import datetime, time, date


class PeerCreate(BaseModel):
    nickname: str
    birthday: datetime


class PeerResponse(PeerCreate):
    pass


class TaskCreate(BaseModel):
    title: str
    max_xp: int
    parent_task: str | None


class TaskResponse(TaskCreate):
    pass


class CheckCreate(BaseModel):
    peer: str
    task: str
    date: datetime


class CheckResponse(CheckCreate):
    id: int


class P2PCreate(BaseModel):
    check: int
    checking_peer: str
    state: str
    time: time


class P2PResponse(P2PCreate):
    id: int


class VerterCreate(BaseModel):
    check: int
    state: str
    time: time


class VerterResponse(VerterCreate):
    id: int


class TransferedPointsCreate(BaseModel):
    checking_peer: str
    checked_peer: str
    points_amount: int


class TransferedPointsResponse(TransferedPointsCreate):
    id: int


class FriendsCreate(BaseModel):
    peer1: str
    peer2: str


class FriendsResponse(FriendsCreate):
    id: int


class RecomendationCreate(BaseModel):
    peer: str
    recommended_peer: str


class RecomendationResponse(RecomendationCreate):
    id: int


class XPCreate (BaseModel):
    check: int
    xp_amount: int


class XPResponse (XPCreate):
    id: int


class TimeTrackingCreate(BaseModel):
    peer: str
    date: date
    time: time
    state: int


class TimeTrackingResponse(TimeTrackingCreate):
    id: int
