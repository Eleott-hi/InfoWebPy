
from pydantic import BaseModel
from datetime import datetime


class PeerCreate(BaseModel):
    nickname: str
    birthday: datetime


class Peer(PeerCreate):
    # id: int

    class Config:
        from_attributes = True
