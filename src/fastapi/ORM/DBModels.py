from sqlalchemy.dialects.postgresql import ENUM
import datetime
from sqlalchemy.orm import (
    sessionmaker,
    Mapped,
    mapped_column,
    relationship,
    DeclarativeBase,
)
from sqlalchemy import (
    create_engine,
    ForeignKey,
    String,
    DateTime,
    Column
)


DATABASE_URL = "postgresql://postgres:postgres@db:5432/postgres"
engine = create_engine(DATABASE_URL, echo=True, future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class Base(DeclarativeBase):
    pass


check_status_enum = ENUM('Start', 'Success', 'Failure',
                         name='check_status', create_type=False)


class Peer(Base):
    __tablename__ = "peers"

    nickname: Mapped[str] = mapped_column(primary_key=True)
    birthday: Mapped[datetime.datetime] = mapped_column(nullable=False)

    def __str__(self):
        return f"Peer(nickname={self.nickname}, birthday={self.birthday})"


class Task(Base):
    __tablename__ = "tasks"

    title: Mapped[str] = mapped_column(primary_key=True)
    max_xp: Mapped[int] = mapped_column(nullable=False)
    parent_task: Mapped[str] = mapped_column(ForeignKey('tasks.title'))

    def __str__(self):
        return f"Task(title={self.title}, parent_task={self.parent_task}, max_xp={self.max_xp})"


class Check(Base):
    __tablename__ = "checks"

    id:   Mapped[int] = mapped_column(primary_key=True)
    peer: Mapped[str] = mapped_column(
        ForeignKey('peers.nickname'), nullable=False)
    task: Mapped[str] = mapped_column(
        ForeignKey('tasks.title'), nullable=False)
    date: Mapped[datetime.datetime] = mapped_column(nullable=False)

    def __str__(self):
        return f"Check(id={self.id}, peer={self.peer}, date={self.date})"


class P2P(Base):
    __tablename__ = "p2p"

    id: Mapped[int] = mapped_column(primary_key=True)
    check: Mapped[int] = mapped_column(
        ForeignKey('checks.id'), nullable=False)
    checking_peer: Mapped[str] = mapped_column(
        ForeignKey('peers.nickname'), nullable=False)
    state = mapped_column(check_status_enum, nullable=False)
    time: Mapped[datetime.time] = mapped_column(nullable=False)

    def __str__(self):
        return f"P2P(id={self.id}, check={self.check}, checking_peer={self.checking_peer}, state={self.state}, time={self.time})"


class Verter(Base):
    __tablename__ = "verter"

    id: Mapped[int] = mapped_column(primary_key=True)
    check: Mapped[int] = mapped_column(
        ForeignKey('checks.id'), nullable=False)
    state = mapped_column(check_status_enum, nullable=False)
    time: Mapped[datetime.time] = mapped_column(nullable=False)

    def __str__(self):
        return f"Verter(id={self.id}, check={self.check}, state={self.state}, time={self.time})"


class TransferredPoints(Base):
    __tablename__ = "transferred_points"

    id: Mapped[int] = mapped_column(primary_key=True)
    checking_peer: Mapped[str] = mapped_column(
        ForeignKey('peers.nickname'), nullable=False)
    checked_peer: Mapped[str] = mapped_column(
        ForeignKey('peers.nickname'), nullable=False)
    points_amount: Mapped[int] = mapped_column(nullable=False)

    def __str__(self):
        return f"TransferredPoints(id={self.id}, checking_peer={self.checking_peer}, checked_peer={self.checked_peer}, points_amount={self.points_amount})"


class Friends(Base):
    __tablename__ = "friends"

    id: Mapped[int] = mapped_column(primary_key=True)
    peer1: Mapped[str] = mapped_column(
        ForeignKey('peers.nickname'), nullable=False)
    peer2: Mapped[str] = mapped_column(
        ForeignKey('peers.nickname'), nullable=False)

    def __str__(self):
        return f"Friends(id={self.id}, peer1={self.peer1}, peer2={self.peer2})"


class Recomendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[int] = mapped_column(primary_key=True)
    peer: Mapped[str] = mapped_column(
        ForeignKey('peers.nickname'), nullable=False)
    recommended_peer: Mapped[str] = mapped_column(
        ForeignKey('peers.nickname'), nullable=False)

    def __str__(self):
        return f"Recomendation(id={self.id}, peer={self.peer}, recommended_peer={self.recommended_peer})"


class XP(Base):
    __tablename__ = "xp"

    id: Mapped[int] = mapped_column(primary_key=True)
    check: Mapped[int] = mapped_column(
        ForeignKey('checks.id'), nullable=False)
    xp_amount: Mapped[int] = mapped_column(nullable=False)

    def __str__(self):
        return f"XP(id={self.id}, check={self.check}, xp_amount={self.xp_amount})"


class TimeTracking(Base):
    __tablename__ = "time_tracking"

    id: Mapped[int] = mapped_column(primary_key=True)
    peer: Mapped[str] = mapped_column(
        ForeignKey('peers.nickname'), nullable=False)
    date: Mapped[datetime.date] = mapped_column(nullable=False)
    time: Mapped[datetime.time] = mapped_column(nullable=False)
    state: Mapped[int] = mapped_column(nullable=False)

    def __str__(self):
        return f"TimeTracking(id={self.id}, peer={self.peer}, date={self.date}, time={self.time}, state={self.state})"


Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    clss = [
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
    ]

    def get(session, cls):
        return session.query(cls).all()

    db = SessionLocal()
    for cls in clss:
        result = get(db, cls)
        for peer in result:
            print(peer)
        print()
    db.close()
