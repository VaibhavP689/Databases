import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
import os
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import utility

# class FileChangeHandler(FileSystemEventHandler):
#     def __init__(self, method_to_run):
#         self.method_to_run = method_to_run

#     def on_modified(self, event):
#         if event.src_path.endswith('data2.json'):
#             print(f"{event.src_path} has been modified. Updating the Excel file...")
#             self.method_to_run()

# def method1():
#     if os.path.exists("mydb2.db") == False:
#         utility.createDatabase("mydb2.db")
#         utility.createTable("Project_1.xlsx", "Sheet2", "mydb2.db")

#     utility.createJSONFileFromDB("Sheet2", "data2.json", "mydb2.db")


# if __name__ == "__main__":
#     path_to_watch = "./static"  # Watch the directory where the JSON file is located
#     event_handler = FileChangeHandler(method1)
#     observer = Observer()
#     observer.schedule(event_handler, path=path_to_watch, recursive=False)
#     observer.start()

#     print("Watching for changes in the JSON file...")

#     try:
#         while True:
#             time.sleep(1)
#     except KeyboardInterrupt:
#         observer.stop()
#     observer.join()

def routeAction(selectedTab):
    if (selectedTab == 1):   
        if os.path.exists("mydb1.db") == False:
            utility.createDatabase("mydb1.db")
            utility.createTable("Project_1.xlsx", "Sheet1", "mydb1.db")
        utility.createJSONFileFromDB("Sheet1", "data1.json", "mydb1.db")
    elif (selectedTab == 2):   
        if os.path.exists("mydb2.db") == False:
            utility.createDatabase("mydb2.db")
            utility.createTable("Project_1.xlsx", "Sheet2", "mydb2.db")
        utility.createJSONFileFromDB("Sheet2", "data2.json", "mydb2.db")
    elif(selectedTab == 3):
        if os.path.exists("mydb3.db") == False:
            utility.createDatabase("mydb3.db")
            utility.createTable("Project_1.xlsx", "Sheet3", "mydb3.db")
        utility.createJSONFileFromDB("Sheet3", "data3.json", "mydb3.db")
    elif(selectedTab == 4):
        if os.path.exists("mydb4.db") == False:
            utility.createDatabase("mydb4.db")
            utility.createTable("Project_1.xlsx", "Sheet4", "mydb4.db")
        utility.createJSONFileFromDB("Sheet4", "data4.json", "mydb4.db")