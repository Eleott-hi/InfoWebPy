import logging
import logging.config
import json
import os
from datetime import datetime


# LOGGING = {
#     "version": 1,
#     "disable_existing_loggers": False,
#     "handlers": {
#         "file": {
#             "level": "INFO",
#             "class": "logging.handlers.TimedRotatingFileHandler",
#             "filename": BASE_DIR.joinpath(
#                 "logs",
#                 f'logs_{datetime.now().strftime("%d-%m-%y-%H-%M-%S")}.log',
#             ),
#             "when": "D",
#             "interval": 1,
#             "formatter": "verbose",
#             "delay": False,
#         },
#     },
#     "loggers": {
#         "retail_app": {
#             "handlers": ["file"],
#             "level": "INFO",
#             "propagate": True,
#         }
#     },
#     "formatters": {
#         "verbose": {
#             "format": "{levelname} UTC {asctime} {message}",
#             "style": "{",
#         },
#     },
# }


def configure_logging_from_json(config_file):
    with open(config_file, "r") as f:
        config = json.load(f)

        log_file_pattern = config["handlers"]["file"]["filename"].format(
            asctime=datetime.now().strftime("%d-%m-%y")
        )
        config["handlers"]["file"]["filename"] = log_file_pattern

        logging.config.dictConfig(config)


def init_logging():
    if not os.path.exists("logs"):
        os.makedirs("logs")

    configure_logging_from_json("logging_config.json")


def get_logger(name):
    return logging.getLogger(name)
