-- ===== FUNCTION 1 =====
CREATE OR REPLACE FUNCTION fnc_1()
    RETURNS TABLE
            (
                Peer1        VARCHAR,
                Peer2        VARCHAR,
                PointsAmount INTEGER
            )
AS
$$
BEGIN
    RETURN QUERY
        WITH t1 AS
                 (SELECT checking_peer, checked_peer, points_amount
                  FROM transferred_points
                  WHERE checking_peer < checked_peer
                  UNION ALL
                  SELECT checked_peer, checking_peer, -points_amount
                  FROM transferred_points
                  WHERE checked_peer < checking_peer)
        SELECT checking_peer, checked_peer, sum(points_amount)::integer
        FROM t1
        GROUP BY checking_peer, checked_peer;
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_1();


-- ===== FUNCTION 2 =====
CREATE OR REPLACE FUNCTION fnc_2()
    RETURNS TABLE
            (
                Peer VARCHAR,
                Task VARCHAR,
                XP   INTEGER
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT checks.peer, checks.task, xp_amount
        FROM checks
                 JOIN xp ON checks.id = xp."check"
                 JOIN tasks t on checks.task = t.title
                 JOIN p2p p on checks.id = p."check"
                 LEFT JOIN verter v on checks.id = v."check"
        WHERE (p.state = 'Success' AND v.state = 'Success')
           OR (p.state = 'Success' AND v.state IS NULL);
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_2();


-- ===== FUNCTION 3 =====
CREATE OR REPLACE FUNCTION fnc_3(p_date DATE)
    RETURNS SETOF VARCHAR
AS
$$
BEGIN
    RETURN QUERY
        SELECT peer
        FROM time_tracking
        WHERE "date" = p_date
          AND state = 1
        EXCEPT
        SELECT peer
        FROM time_tracking
        WHERE "date" = p_date
          AND state = 2;
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_3('2023-01-04');


-- ===== FUNCTION 4 =====
CREATE OR REPLACE FUNCTION fnc_4()
    RETURNS TABLE
            (
                SuccessfulChecks   FLOAT,
                UnsuccessfulChecks FLOAT
            )
AS
$$
BEGIN
    RETURN QUERY
        WITH t1 AS (SELECT (SELECT count(*)
                            FROM p2p
                            WHERE state = 'Success')                    AS p2p_success,
                           (SELECT count(*)
                            FROM (SELECT *
                                  FROM p2p
                                  WHERE state = 'Success'
                                  UNION
                                  SELECT *
                                  FROM p2p
                                  WHERE state = 'Failure') AS p2p_subq) AS p2p_overall,
                           (SELECT count(*)
                            FROM verter
                            WHERE state = 'Success')                    AS vrt_success,
                           (SELECT count(*)
                            FROM (SELECT *
                                  FROM verter
                                  WHERE state = 'Success'
                                  UNION
                                  SELECT *
                                  FROM verter
                                  WHERE state = 'Failure') AS vrt_subq) AS vrt_overall)
        SELECT success_percentage, 100 - success_percentage
        FROM (SELECT p2p_success::float / p2p_overall * 100 AS success_percentage
              FROM t1) AS t2;
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_4();


-- ===== FUNCTION 5 =====
CREATE OR REPLACE FUNCTION fnc_5()
    RETURNS TABLE
            (
                Peer         VARCHAR,
                PointsChange INTEGER
            )
AS
$$
BEGIN
    RETURN QUERY
        WITH t1 AS (SELECT nickname, coalesce(sum(points_amount), 0) AS points_recieved
                    FROM peers
                             LEFT JOIN transferred_points ON nickname = checking_peer
                    GROUP BY nickname),
             t2 AS (SELECT nickname, coalesce(sum(points_amount), 0) AS points_given
                    FROM peers
                             LEFT JOIN transferred_points ON nickname = checked_peer
                    GROUP BY nickname),
             t3 AS (SELECT *
                    FROM t1
                             NATURAL JOIN t2)

        SELECT nickname, (points_recieved - points_given)::integer AS points
        FROM t3
        ORDER BY points DESC;
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_5();


-- ===== FUNCTION 6 =====
CREATE OR REPLACE FUNCTION fnc_6()
    RETURNS TABLE
            (
                Peer         VARCHAR,
                PointsChange INTEGER
            )
AS
$$
BEGIN
    RETURN QUERY
        WITH t1 AS (SELECT Peer1, Peer2, PointsAmount
                    FROM fnc_1()
                    UNION ALL
                    SELECT Peer2, Peer1, -PointsAmount
                    FROM fnc_1())
        SELECT Peer1, sum(PointsAmount)::integer AS points
        FROM t1
        GROUP BY Peer1
        ORDER BY points DESC;
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_6();


-- ===== FUNCTION 7 =====
CREATE OR REPLACE FUNCTION fnc_7()
    RETURNS TABLE
            (
                Day  DATE,
                Task VARCHAR
            )
AS
$$
BEGIN
    RETURN QUERY
        WITH t1 AS (SELECT "date", checks.task, count(checks.task) AS amount
                    FROM checks
                    GROUP BY "date", checks.task
                    ORDER BY "date")
        SELECT "date", split_part(t1.task, '_', 1)::varchar
        FROM t1
        WHERE amount = (SELECT max(t2.amount)
                        FROM t1 t2
                        WHERE t1.date = t2.date);
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_7();


-- ===== FUNCTION 8 =====
CREATE OR REPLACE FUNCTION fnc_8()
    RETURNS SETOF TIME AS
$$
BEGIN
    RETURN QUERY
        WITH t1 AS (SELECT id
                    FROM checks
                    WHERE checks.date = (SELECT max(checks.date)
                                         FROM checks))
        SELECT ((SELECT p2p.time
                 FROM t1
                          JOIN p2p ON t1.id = p2p.check
                 WHERE p2p.state = 'Success'
                    OR p2p.state = 'Failure')
            -
                (SELECT p2p.time
                 FROM t1
                          JOIN p2p ON t1.id = p2p.check
                 WHERE p2p.state = 'Start'))::time;
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_8();


-- ===== FUNCTION 9 =====
CREATE OR REPLACE FUNCTION fnc_9(p_task_section VARCHAR)
    RETURNS TABLE
            (
                Peer VARCHAR,
                Day  DATE
            )
AS
$$
BEGIN
    RETURN QUERY
        WITH t1 AS (SELECT title
                    FROM tasks
                    WHERE title SIMILAR TO p_task_section || '\d+\_%'),
             t2 AS (SELECT f2.peer, count(task) AS completed_tasks_amount
                    FROM fnc_2() f2
                    WHERE task SIMILAR TO p_task_section || '\d+\_%'
                    GROUP BY f2.peer),
             t3 AS (SELECT t2.peer
                    FROM t2
                             JOIN t1 ON completed_tasks_amount = (SELECT count(*)
                                                                  FROM t1))
        SELECT t3.peer, max(checks.date)
        FROM t3
                 LEFT JOIN checks ON t3.peer = checks.peer
        GROUP BY t3.peer;
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_9('SQL');


-- ===== FUNCTION 10 =====
CREATE OR REPLACE FUNCTION fnc_10()
    RETURNS TABLE
            (
                Peer            VARCHAR,
                RecommendedPeer VARCHAR
            )
AS
$$
BEGIN
    RETURN QUERY
        WITH t1 AS (SELECT nickname, recommended_peer, count(recommended_peer) AS commends
                    FROM peers
                             LEFT JOIN friends f on peers.nickname = f.peer1
                             LEFT JOIN recommendations r on f.peer2 = r.peer
                    GROUP BY nickname, recommended_peer)
        SELECT t1.nickname, coalesce(t1.recommended_peer, 'n/a')
        FROM t1
        WHERE commends = (SELECT max(t2.commends)
                          FROM t1 t2
                          WHERE t1.nickname = t2.nickname);
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_10();


-- ===== FUNCTION 11 =====
CREATE OR REPLACE FUNCTION fnc_11(block_1 VARCHAR, block_2 VARCHAR)
    RETURNS TABLE
            (
                StartedBlock1      INTEGER,
                StartedBlock2      INTEGER,
                StartedBothBlocks  INTEGER,
                DidntStartAnyBlock INTEGER
            )
AS
$$
BEGIN
    RETURN QUERY
        WITH started_block_1 AS (SELECT DISTINCT peer FROM checks WHERE task SIMILAR TO block_1 || '\d+\_%'),
             started_block_2 AS (SELECT DISTINCT peer FROM checks WHERE task SIMILAR TO block_2 || '\d+\_%'),
             started_only_block_1 AS (SELECT * FROM started_block_1 EXCEPT SELECT * FROM started_block_2),
             started_only_block_2 AS (SELECT * FROM started_block_2 EXCEPT SELECT * FROM started_block_1),
             started_both_blocks AS (SELECT * FROM started_block_1 INTERSECT SELECT * FROM started_block_2),
             didnt_start_any_block AS (SELECT nickname
                                       FROM peers
                                       EXCEPT
                                       (SELECT * FROM started_block_1 UNION SELECT * FROM started_block_2))
        SELECT (SELECT (count(*) * 100.0 / total)::integer FROM started_only_block_1),
               (SELECT (count(*) * 100.0 / total)::integer FROM started_only_block_2),
               (SELECT (count(*) * 100.0 / total)::integer FROM started_both_blocks),
               (SELECT (count(*) * 100.0 / total)::integer FROM didnt_start_any_block)
        FROM (SELECT count(*) AS total FROM peers) X;
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_11('C', 'D');


-- ===== FUNCTION 12 =====
CREATE OR REPLACE FUNCTION fnc_12(IN times_ INTEGER)
    RETURNS TABLE
            (
                Peer         VARCHAR,
                FriendsCount BIGINT
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT peers.nickname, count(friend) AS f_count
        FROM (SELECT peer1 AS peer, peer2 AS friend
              FROM friends
              UNION
              SELECT peer2 AS peer, peer1 AS friend
              FROM friends) X
                 RIGHT JOIN peers ON X.peer = peers.nickname
        GROUP BY peers.nickname
        ORDER BY f_count DESC
        LIMIT times_;
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_12(2);


-- ===== FUNCTION 13 =====
CREATE OR REPLACE FUNCTION fnc_13()
    RETURNS TABLE
            (
                SuccessfulChecks   INTEGER,
                UnsuccessfulChecks INTEGER
            )
AS
$$
DECLARE
    total integer := (SELECT count(*)
                      FROM peers);
BEGIN
    RETURN QUERY
        WITH info AS (SELECT peer,
                             string_agg((CASE WHEN xp_amount IS NULL THEN 'Failure' ELSE 'Success' END), ', ') state
                      FROM checks
                               JOIN peers ON checks.peer = peers.nickname AND
                                             to_char(checks.date, 'MM-DD') = to_char(peers.birthday, 'MM-DD')
                               LEFT JOIN xp ON checks.id = xp.check
                      GROUP by peer)
        SELECT (count(CASE WHEN position('Success' IN state) > 0 THEN 1 else NULL END) * 100.0 /
                total)::integer,
               (count(CASE WHEN position('Failure' IN state) > 0 THEN 1 else NULL END) * 100.0 /
                total)::integer
        FROM info;
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_13();


-- ===== FUNCTION 14 =====
CREATE OR REPLACE FUNCTION fnc_14()
    RETURNS TABLE
            (
                Peer VARCHAR,
                XP   BIGINT
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT xp_per_block.peer, sum(max_xp)
        FROM (SELECT checks.peer, task, max(xp_amount) AS max_xp
              FROM checks
                       JOIN xp ON checks.id = xp.check
              GROUP BY checks.peer, task) xp_per_block
        GROUP BY xp_per_block.peer
        ORDER BY 2 DESC;
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_14();


-- ===== FUNCTION 15 =====
CREATE OR REPLACE FUNCTION fnc_15(in task_1 VARCHAR, in task_2 VARCHAR,
                                  in task_3 VARCHAR)
    RETURNS SETOF VARCHAR
AS
$$
BEGIN
    RETURN QUERY
        SELECT peer
        FROM (SELECT peer, string_agg(task, ', ') AS titles
              FROM checks
                       JOIN xp ON checks.id = xp.check
              GROUP BY peer) X
        WHERE POSITION(task_1 IN titles) > 0
          AND POSITION(task_2 IN titles) > 0
          AND POSITION(task_3 IN titles) = 0;
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_15('C3_SimpleBashUtils', 'C5_s21_decimal', 'D01_Linux');


-- ===== FUNCTION 16 =====
CREATE OR REPLACE FUNCTION fnc_16()
    RETURNS TABLE
            (
                Task      VARCHAR,
                PrevCount BIGINT
            )
AS
$$
BEGIN
    RETURN QUERY
        WITH RECURSIVE recursive_tasks AS (SELECT title, parent_task
                                           FROM tasks
                                           UNION ALL
                                           SELECT recursive_tasks.title, tasks.parent_task
                                           FROM recursive_tasks
                                                    JOIN tasks ON recursive_tasks.parent_task = tasks.title)
        SELECT title, count(DISTINCT parent_task)
        FROM recursive_tasks
        GROUP BY title
        ORDER by 2;
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_16();


-- ===== FUNCTION 17 =====
CREATE OR REPLACE FUNCTION fnc_17(times_ IN INTEGER)
    RETURNS SETOF DATE AS
$$
BEGIN
    RETURN QUERY
        WITH p2p_checks AS (SELECT checks.id AS id, date, time, max_xp
                            FROM p2p
                                     JOIN checks ON checks.id = p2p.check
                                     JOIN tasks ON title = checks.task
                            WHERE state = 'Start'),
             p2p_checks_xp AS (SELECT date,
                                      time,
                                      (CASE WHEN xp_amount >= max_xp * 0.8 THEN xp_amount else NULL END),
                                      xp_amount
                               FROM p2p_checks
                                        LEFT JOIN xp ON xp.check = p2p_checks.id)
        SELECT "date"
        FROM (SELECT "date",
                     "time",
                     (CASE
                          WHEN xp_amount IS NULL THEN 0
                          ELSE row_number() OVER (PARTITION BY "date", X ORDER BY "date", "time") END)
              FROM (SELECT "date",
                           "time",
                           xp_amount,
                           count(CASE WHEN xp_amount IS NULL THEN 1 END)
                           OVER (PARTITION BY "date", "time" ORDER BY "date", "time") X
                    FROM p2p_checks_xp) Q
              ORDER BY "date", "time") date_time_row_num
        GROUP BY "date"
        HAVING max(row_number) >= times_;
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_17(2);


-- ===== FUNCTION 18 =====
CREATE OR REPLACE FUNCTION fnc_18()
    RETURNS TABLE
            (
                Peer VARCHAR,
                XP   BIGINT
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT p2p_success_info.peer, count(*)
        FROM (SELECT checks.id AS "check", checks.peer
              FROM checks
                       LEFT JOIN p2p ON p2p.check = checks.id
              WHERE state = 'Success') AS p2p_success_info
                 LEFT JOIN verter ON p2p_success_info.check = verter.check
        WHERE state IS NULL
           OR state = 'Success'
        GROUP BY p2p_success_info.peer
        ORDER BY 2 DESC
        LIMIT 1;
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_18();


-- ===== FUNCTION 19 =====
CREATE OR REPLACE FUNCTION fnc_19()
    RETURNS TABLE
            (
                Peer VARCHAR,
                XP   BIGINT
            )
AS
$$
BEGIN
    RETURN QUERY 
        SELECT * 
        FROM fnc_14()
        LIMIT 1;
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_19();


-- ===== FUNCTION 20 =====
CREATE OR REPLACE FUNCTION fnc_20()
    RETURNS SETOF VARCHAR AS
$$
BEGIN
    RETURN QUERY
        WITH today_info AS (SELECT * FROM time_tracking WHERE date = current_date),
             in_info AS (SELECT row_number() OVER () AS rnum, * FROM today_info WHERE state = 1),
             out_info AS (SELECT row_number() OVER () AS rnum, * FROM today_info WHERE state = 2),
             in_out_info AS (SELECT in_info.peer                   AS peer,
                                    in_info.time                   AS in,
                                    out_info.time                  AS out,
                                    (out_info.time - in_info.time) AS duration
                             FROM in_info
                                      JOIN out_info ON in_info.rnum = out_info.rnum),
             peer_duration AS (SELECT peer, sum(duration) AS duration FROM in_out_info GROUP BY peer)
        SELECT peer
        FROM peer_duration
        ORDER BY Duration DESC
        LIMIT 1;
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_20();


-- ===== FUNCTION 21 =====
CREATE OR REPLACE FUNCTION fnc_21(IN time_ TIME, IN times_ INTEGER)
    RETURNS SETOF VARCHAR AS
$$
BEGIN
    RETURN QUERY
        SELECT peer
        FROM (SELECT peer, "date", min(time)
              FROM time_tracking
              GROUP BY peer, "date"
              HAVING min(time) >= '09:00:00') AS info
        GROUP BY peer
        HAVING count(*) >= times_;
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_21('09:00:00', 2);


-- ===== FUNCTION 22 =====
CREATE OR REPLACE FUNCTION fnc_22(IN days_ INTEGER, IN times_ INTEGER)
    RETURNS SETOF VARCHAR AS
$$
BEGIN
    RETURN QUERY
        SELECT peer
        FROM time_tracking
        WHERE state = 2
          AND date >= current_date - days_
        GROUP BY peer
        HAVING count(*) > times_;
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_22(2, 1);


-- ===== FUNCTION 23 =====
CREATE OR REPLACE FUNCTION fnc_23()
    RETURNS SETOF VARCHAR AS
$$
BEGIN
    RETURN QUERY
        SELECT peer
        FROM (SELECT peer, "date", min(time) AS arrival_time
              FROM time_tracking
              WHERE state = 1
                AND "date" = current_date
              GROUP BY peer, "date"
              ORDER BY arrival_time DESC)
                 AS info
        LIMIT 1;
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_23();


-- ===== FUNCTION 24 =====
CREATE OR REPLACE FUNCTION fnc_24(minnum INTEGER)
    RETURNS SETOF VARCHAR AS
$$
BEGIN
    RETURN QUERY
        WITH yesterday_data AS (SELECT peer, "date", "time", state
                                FROM time_tracking
                                WHERE "date" = (current_date - 1)
                                ORDER BY Peer, "date", "time", state),
             in_info AS (SELECT row_number() OVER () AS rnum, * FROM yesterday_data WHERE state = 1),
             out_info AS (SELECT row_number() OVER () AS rnum, * FROM yesterday_data WHERE state = 2),
             earliest_in AS (SELECT peer, "date", min("time") AS first_in FROM in_info GROUP BY peer, "date"),
             latest_out AS (SELECT peer, "date", max("time") AS last_out FROM out_info GROUP BY peer, "date"),
             visits AS (SELECT in_info.peer, in_info."date", in_info."time" AS in_time, out_info."time" AS out_time
                        FROM in_info
                                 JOIN out_info ON in_info.rnum = out_info.rnum),
             school_time AS (SELECT earliest_in.peer, earliest_in."date", first_in, last_out
                             FROM earliest_in
                                      JOIN latest_out ON earliest_in.peer = latest_out.peer AND
                                                         earliest_in."date" = latest_out."date"),
             inside_info AS (SELECT peer, "date", sum(out_time - in_time) AS inside_time
                             FROM visits
                             GROUP BY peer, "date"),
             outside_info AS (SELECT inside_info.peer,
                                     inside_info."date",
                                     inside_time,
                                     first_in,
                                     last_out,
                                     (last_out - first_in - inside_time) AS outside_time
                              FROM inside_info
                                       JOIN school_time ON inside_info.peer = school_time.peer AND
                                                           inside_info."date" = school_time."date")

        SELECT peer
        FROM outside_info
        WHERE outside_time > make_interval(mins := minnum);
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_24(29);


-- ===== FUNCTION 25 =====
CREATE OR REPLACE FUNCTION fnc_25()
    RETURNS TABLE
            (
                Month        TEXT,
                EarlyEntries NUMERIC
            )
AS
$$
BEGIN
    RETURN QUERY
        WITH months AS (SELECT id, to_char(to_date(id::text, 'MM'), 'Month') AS name
                        FROM generate_series(1, 12) AS id),
             peers_per_month AS (SELECT *
                                 FROM months
                                          LEFT JOIN Peers ON months.id = extract('Month' FROM Peers.birthday)
                                 ORDER BY months.id),
             in_info AS (SELECT peer, "date", "time" FROM time_tracking WHERE "state" = 1),
             earliest_in AS (SELECT peer, "date", min("time") AS first_in FROM in_info GROUP BY peer, "date"),
             grouped_peers AS (SELECT peer,
                                      count(*) FILTER (WHERE first_in < '12:00:00') AS early_visits,
                                      count(*)                                      AS visits
                               FROM earliest_in
                               GROUP BY peer),
             aggregate AS (SELECT id, name, sum(early_visits) AS early_count, sum(visits) AS total
                           FROM peers_per_month
                                    LEFT JOIN grouped_peers ON peers_per_month.nickname = grouped_peers.peer
                           GROUP BY id, name
                           ORDER BY id)

        SELECT name, coalesce(round(early_count / total * 100), 0)
        FROM aggregate;
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM fnc_25();
