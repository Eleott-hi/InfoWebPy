 DROP SCHEMA public CASCADE;
 CREATE SCHEMA public;

-- Peers
CREATE TABLE IF NOT EXISTS peers
(
    nickname VARCHAR PRIMARY KEY,
    birthday DATE NOT NULL
);


-- Tasks
CREATE TABLE IF NOT EXISTS tasks
(
    title       VARCHAR PRIMARY KEY,
    parent_task VARCHAR REFERENCES tasks (title) ON DELETE CASCADE,
    max_xp      INTEGER NOT NULL
);

CREATE UNIQUE INDEX idx_tasks_parent_task_null_unique
    ON tasks ((parent_task IS NULL)) WHERE parent_task IS NULL;


-- Check status type
CREATE TYPE check_status AS ENUM ('Start', 'Success', 'Failure');


-- Checks
CREATE TABLE IF NOT EXISTS checks
(
    id     SERIAL PRIMARY KEY,
    peer   VARCHAR NOT NULL REFERENCES peers (nickname) ON DELETE CASCADE,
    task   VARCHAR NOT NULL REFERENCES tasks (title) ON DELETE CASCADE,
    "date" DATE    NOT NULL
);


-- P2P
CREATE TABLE IF NOT EXISTS p2p
(
    id            SERIAL PRIMARY KEY,
    "check"       INTEGER      NOT NULL REFERENCES checks (id) ON DELETE CASCADE,
    checking_peer VARCHAR      NOT NULL REFERENCES peers (nickname) ON DELETE CASCADE,
    state         check_status NOT NULL,
    "time"        TIME         NOT NULL
);

CREATE UNIQUE INDEX idx_p2p_check_state_start_unique
    ON p2p ("check", (state = 'Start'));


-- Verter
CREATE TABLE IF NOT EXISTS verter
(
    id      SERIAL PRIMARY KEY,
    "check" INTEGER      NOT NULL REFERENCES checks (id) ON DELETE CASCADE,
    state   check_status NOT NULL,
    "time"  TIME         NOT NULL
);

CREATE OR REPLACE FUNCTION fnc_p2p_success(p_check INTEGER)
    RETURNS BOOLEAN AS
$$
BEGIN
    RETURN exists(SELECT *
                  FROM p2p
                  WHERE "check" = p_check
                    AND state = 'Success');
END;
$$ LANGUAGE plpgsql;

ALTER TABLE verter
    ADD CONSTRAINT ch_p2p_state_success check ( fnc_p2p_success("check") );


-- Transferred Points
CREATE TABLE IF NOT EXISTS transferred_points
(
    id            SERIAL PRIMARY KEY,
    checking_peer VARCHAR NOT NULL REFERENCES peers (nickname) ON DELETE CASCADE,
    checked_peer  VARCHAR NOT NULL REFERENCES peers (nickname) ON DELETE CASCADE,
    points_amount INTEGER NOT NULL
);


-- Friends
CREATE TABLE IF NOT EXISTS friends
(
    id    SERIAL PRIMARY KEY,
    peer1 VARCHAR NOT NULL REFERENCES peers (nickname) ON DELETE CASCADE,
    peer2 VARCHAR NOT NULL REFERENCES peers (nickname) ON DELETE CASCADE
);


-- Recommendations
CREATE TABLE IF NOT EXISTS recommendations
(
    id               SERIAL PRIMARY KEY,
    peer             VARCHAR NOT NULL REFERENCES peers (nickname) ON DELETE CASCADE,
    recommended_peer VARCHAR NOT NULL REFERENCES peers (nickname) ON DELETE CASCADE
);


-- XP
CREATE TABLE IF NOT EXISTS xp
(
    id        SERIAL PRIMARY KEY,
    "check"   INTEGER NOT NULL REFERENCES checks (id) ON DELETE CASCADE,
    xp_amount INTEGER NOT NULL
);

CREATE OR REPLACE FUNCTION fnc_xp_amount_correct(p_check INTEGER, p_xp_amount INTEGER)
    RETURNS BOOLEAN AS
$$
BEGIN
    RETURN exists(SELECT *
                  FROM checks
                           JOIN tasks ON tasks.title = checks.task
                  WHERE checks.id = p_check
                    AND max_xp >= p_xp_amount);
END;
$$ LANGUAGE plpgsql;

ALTER TABLE xp
    ADD CONSTRAINT ch_xp_xp_amount_correct check ( fnc_xp_amount_correct("check", xp_amount) );


-- Time Tracking
CREATE TABLE IF NOT EXISTS time_tracking
(
    id     SERIAL PRIMARY KEY,
    peer   VARCHAR NOT NULL REFERENCES peers (nickname) ON DELETE CASCADE,
    "date" DATE    NOT NULL,
    "time" TIME    NOT NULL,
    state  INTEGER NOT NULL -- 1-in, 2-out
);


-- IMPORT
CREATE OR REPLACE PROCEDURE prc_import_csv(p_table_name VARCHAR, p_columns VARCHAR, p_path VARCHAR, p_delimiter CHAR)
AS
$$
BEGIN
    EXECUTE concat('COPY ', p_table_name, ' ', p_columns,
                   ' FROM ', '''', p_path, p_table_name, '.csv', '''',
                   ' DELIMITER ''', p_delimiter, '''', ' CSV HEADER');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE prc_export_csv(p_table_name VARCHAR, p_path VARCHAR, p_delimiter CHAR)
AS
$$
BEGIN
    EXECUTE concat('COPY ', p_table_name,
                   ' TO ', '''', p_path, p_table_name, '.csv', '''',
                   ' DELIMITER ''', p_delimiter, '''', ' CSV HEADER');
END;
$$ LANGUAGE plpgsql;

DO
$$
    DECLARE
        path VARCHAR := '/docker-entrypoint-initdb.d/datasets/';
    BEGIN
        CALL prc_import_csv('peers', '(nickname, birthday)', path, ',');
        CALL prc_import_csv('tasks', '(title, parent_task, max_xp)', path, ',');
        CALL prc_import_csv('checks', '(peer, task, "date")', path, ',');
        CALL prc_import_csv('friends', '(peer1, peer2)', path, ',');
        CALL prc_import_csv('p2p', '("check", checking_peer, state, "time")', path, ',');
        CALL prc_import_csv('recommendations', '(peer, recommended_peer)', path, ',');
        CALL prc_import_csv('time_tracking', '(peer, "date", "time", state)', path, ',');
        CALL prc_import_csv('transferred_points', '(checking_peer, checked_peer, points_amount)', path, ',');
        CALL prc_import_csv('verter', '("check", state, "time")', path, ',');
        CALL prc_import_csv('xp', '("check", xp_amount)', path, ',');
    END;
$$;