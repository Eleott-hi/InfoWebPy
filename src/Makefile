SERVER_DIR := info_21_web_fastapi
SERVER_HOST := 0.0.0.0
SERVER_PORT := 8000
SERVER_RELOAD := --reload

UI_DIR := info_21_web_ui

DB_DIR := database

runserver:
	cd $(SERVER_DIR); uvicorn main:app --host $(SERVER_HOST) --port $(SERVER_PORT) $(SERVER_RELOAD)

runui:
	cd $(UI_DIR); npm run dev

postgres: clean_db
	cd $(DB_DIR); docker-compose up 

clean_db:
	-docker stop db
	-docker rm db

orm:
	cd $(SERVER_DIR); python3 orm.py
