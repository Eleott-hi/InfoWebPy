/* 
 1. Написать процедуру добавления P2P проверки:
 - Параметры: ник проверяемого, ник проверяющего, название задания, статус P2P проверки, время.
 - Если задан статус "начало", добавить запись в таблицу Checks (в качестве даты использовать сегодняшнюю).
 - Добавить запись в таблицу P2P.
 - Если задан статус "начало", в качестве проверки указать только что добавленную запись,
 иначе указать проверку с незавершенным P2P этапом.
*/

CREATE OR REPLACE PROCEDURE prc_add_p2p_check(p_checked_peer  VARCHAR, 
                                            p_checking_peer VARCHAR,
                                            p_task          VARCHAR,
                                            p_state         check_status,
                                            p_time          TIME) 
AS $$
DECLARE
check_id INTEGER := (SELECT checks.id FROM checks 
                     JOIN p2p ON  checks.id = p2p."check" AND checks.peer = p_checked_peer
                              AND p2p.checking_peer = p_checking_peer AND checks.task = p_task
                     GROUP BY Checks.id HAVING COUNT(p2p.state) = 1);
BEGIN
if (p_state = 'Start') THEN 
    INSERT INTO checks VALUES (DEFAULT, p_checked_peer, p_task, now()::timestamp);
    check_id := (SELECT MAX(ID) FROM checks);
END IF;
INSERT INTO p2p VALUES (DEFAULT, check_id, p_checking_peer, p_state, p_time);
END;
$$ LANGUAGE plpgsql;


/* 
 2. Написать процедуру добавления проверки Verter'ом:
 - Параметры: ник проверяемого, название задания, статус проверки Verter'ом, время. 
 - Добавить запись в таблицу Verter (в качестве проверки указать проверку соответствующего 
   задания с самым поздним (по времени) успешным P2P этапом)
*/


CREATE OR REPLACE PROCEDURE prc_add_verter_check(p_checked_peer  VARCHAR,
                                                 p_task          VARCHAR,
                                                 p_state         check_status,
                                                 p_time          TIME)
AS $$
DECLARE
last_success_check_id INTEGER := (SELECT checks.id FROM checks
                                  JOIN p2p ON  checks.id = p2p.check AND checks.task = p_task
                                           AND p2p.state = 'Success' AND checks.peer = p_checked_peer
                                  ORDER BY "date" DESC, "time" DESC LIMIT 1);
BEGIN
INSERT INTO verter VALUES (DEFAULT, last_success_check_id, p_state, p_time);
END;
$$ LANGUAGE plpgsql;


/*
 3. Написать триггер: 
 - После добавления записи со статутом "начало" в таблицу P2P,
   изменить соответствующую запись в таблице TransferredPoints.
*/

CREATE OR REPLACE FUNCTION fnc_trg_change_transferred_points() RETURNS TRIGGER
AS $$
DECLARE
p_checked_peer  VARCHAR := (SELECT peer FROM checks WHERE id = NEW.check);
p_transfer_id   INTEGER := (SELECT id FROM transferred_points WHERE checking_peer = NEW.checking_peer
                                                              AND   checked_peer  = p_checked_peer);
BEGIN
IF (NEW.State <> 'Start') THEN 
    RETURN NULL;
END IF;
IF (p_transfer_id IS NULL) THEN
    INSERT INTO transferred_points VALUES (DEFAULT, NEW.checking_peer, p_checked_peer, 1);
ELSE
    UPDATE transferred_points SET points_amount = points_amount + 1 WHERE id = p_transfer_id;
END IF;
RETURN NULL;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE TRIGGER trg_p2p_after_insert AFTER INSERT ON p2p
FOR EACH ROW EXECUTE PROCEDURE fnc_trg_change_transferred_points();


/*
4. Написать триггер: перед добавлением записи в таблицу XP, проверить корректность добавляемой записи
   Запись считается корректной, если:
        - Количество XP не превышает максимальное доступное для проверяемой задачи
        - Поле Check ссылается на успешную проверку.
   Если запись не прошла проверку, не добавлять её в таблицу.
*/

CREATE OR REPLACE FUNCTION fnc_trg_xp_before_insert() RETURNS TRIGGER
AS $$
DECLARE
p_max_xp        INTEGER      := (SELECT max_xp  FROM tasks  WHERE title = (SELECT task FROM checks WHERE id = NEW.check));
p_p2p_state     check_status := (SELECT "state" FROM p2p    WHERE p2p.check    = NEW.check AND "state" <> 'Start');
p_verter_started BOOLEAN     :=  EXISTS (SELECT "state" FROM verter WHERE verter.check = NEW.check AND "state" = 'Start');
p_verter_state  check_status := (SELECT "state" FROM verter WHERE verter.check = NEW.check AND "state" <> 'Start');
BEGIN
IF (NEW.xp_amount > p_max_xp) THEN
    RAISE EXCEPTION 'XP amount greater than Max XP for this task';
END IF;
IF (p_p2p_state <> 'Success') THEN
    RAISE EXCEPTION 'P2P check is not success';
END IF;
IF (p_verter_started AND p_verter_state <> 'Success') THEN
    RAISE EXCEPTION 'Verter check is not success';
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE TRIGGER trg_xp_before_insert BEFORE INSERT ON xp
FOR EACH ROW EXECUTE PROCEDURE fnc_trg_xp_before_insert();







-- -- Test 1
-- CALL prc_add_p2p_check ('flamelgl', 'faraldma', 'C6_s21_matrix',            'Start',   '13:12'::TIME);
-- CALL prc_add_p2p_check ('flamelgl', 'faraldma', 'C6_s21_matrix',            'Success', '13:32'::TIME);
-- CALL prc_add_p2p_check ('cgreenbe', 'pintoved', 'C7_SmartCalc_v1.0',        'Start',   '13:12'::TIME);
-- CALL prc_add_p2p_check ('cgreenbe', 'pintoved', 'C7_SmartCalc_v1.0',        'Success', '13:32'::TIME);
-- CALL prc_add_p2p_check ('addaclic', 'accordij', 'D03_LinuxMonitoring_v1.0', 'Start',   '15:30'::TIME);
-- CALL prc_add_p2p_check ('addaclic', 'accordij', 'D03_LinuxMonitoring_v1.0', 'Failure', '15:50'::TIME);
-- CALL prc_add_p2p_check ('sshunpik', 'flamelgl', 'D05_SimpleDocker',         'Start',   '15:40'::TIME);
-- CALL prc_add_p2p_check ('sshunpik', 'flamelgl', 'D05_SimpleDocker',         'Failure', '16:05'::TIME);
-- CALL prc_add_p2p_check ('bellatri', 'bromanyt', 'CPP4_3DViewer_v2.0',       'Start',   '15:00'::TIME);
-- CALL prc_add_p2p_check ('bellatri', 'bromanyt', 'CPP4_3DViewer_v2.0',       'Success', '16:23'::TIME);
-- CALL prc_add_p2p_check ('bromanyt', 'bgreydon', 'C7_SmartCalc_v1.0',        'Start',   '18:00'::TIME);
-- CALL prc_add_p2p_check ('bromanyt', 'bgreydon', 'C7_SmartCalc_v1.0',        'Success', '18:12'::TIME);
-- CALL prc_add_verter_check ('flamelgl',          'C6_s21_matrix' ,           'Start',   '13:33'::TIME);
-- CALL prc_add_verter_check ('flamelgl',          'C6_s21_matrix' ,           'Success', '13:34'::TIME);

-- Tests
-- INSERT INTO XP VALUES (DEFAULT, 17, 500);  -- Success no verter  
-- INSERT INTO XP VALUES (DEFAULT, 16, 200);  -- Success
-- INSERT INTO XP VALUES (DEFAULT, 1, 1000);  -- XP > MAX_XP
-- INSERT INTO XP VALUES (DEFAULT, 9, 300);   -- P2P not success
-- INSERT INTO XP VALUES (DEFAULT, 5, 245);   -- Verter not success

-- SELECT * FROM checks;
-- SELECT * FROM P2P;
-- SELECT * FROM verter;
-- SELECT * FROM transferred_points;
-- SELECT * from xp;

