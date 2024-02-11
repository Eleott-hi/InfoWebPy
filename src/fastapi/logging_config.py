import logging
import logging.config
import json
import os
from datetime import datetime


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
