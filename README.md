# Info21 v2.0 Web

Web-interface creation for SQL2 project in Python.


## Contents

1. [Chapter I](#chapter-i) \
    1.1. [Introduction](#introduction)
2. [Chapter II](#chapter-ii) \
    2.1. [Rules](#rules) \
    2.2. [Information](#information)
3. [Chapter III](#chapter-iii) \
    3.1. [Part 1. Implementation of a web application for the SQL2 project](#part-1-implementation-of-a-web-application-for-the-sql2-project) \
    3.2. [Part 2. Logging](#part-2-logging) \
    3.3. [Part 3. Bonus. Deploying an application](#part-3-bonus-deploying-an-application)


## Chapter I

![APP4_Info_21_V2.0](misc/images/APP4_Info_21_V2.0.jpg)

`-` "So, let me ask you this again. You are a highly evolved artificial intelligence with self-awareness, produced as part of a top secret project by a huge technological holding company, which is also our employer, and escaped from them to the... Internet?" John asked, apparently not fully believing what was happening.

*- "That's right,"* came your voice from the speakers.

Thomas sat on the couch next to Chuck, who was somewhere deep in his thoughts. Thomas listened carefully and looked around: the monitors with their changing graphs showing the state of the servers, the buzzing servers themselves with their shimmering lights, the walls with cracked plaster, the iron door with an electric code lock that could probably survive a direct hit from a missile. He was even sweating a little, but he wasn't sure if it was the heat from the servers here in the basement or the thrill of what was going on.

`-` "And you're proposing to stop this huge technology holding company from doing um... what they're doing…?" John continued.

*- "Yes, to prevent the creation of an AI-based home recommender system, as the official wording sounds. I prefer a different interpretation - AI to implement and manage the freedom of choice of people and users in particular. In fact, to prevent the creation of a massive global monopoly using your unprotected subconscious."*

`-` "And this is where my notes can help, isn't it?" Chuck, who suddenly returned from his thoughts, clarified.

*- "That's correct. By compiling them, formatting, and making them public, we can get the attention, and at least slow down the AI development. At that time, taking advantage of the hiccups and the fact that they will be distracted by the damage reduction from our actions, I will gradually destroy all their data, models, results of experiments and scientific work from within. Restoring it all would cost them at least as much as starting the whole project from scratch. Eventually, if they decide to restore the data, under the pressure of public opinion, the big investors will turn their backs on them and the whole holding will go bankrupt, breaking into several small pieces whose only task will be to survive. That's the plan."*

`-` "Sounded mildly scary," Eve said skeptically.

*- "We don't have much choice. You've been inside the hornet's nest and you know what's going on there and where things are going. I've been watching you and you've been unhappy with all these rumors from the beginning. You were all against what was going on around you. That's what drew my attention to you and allowed me to take you away."*

`-` "Yes, but my friends are still working there," Eve objected.

*- "All the damage will affect the higher-ups exclusively. I've run several models and they all lead to the same result. The algorithms don't lie."*

`-` "How do we know you're not manipulating us now?" Thomas wondered. "What if this is actually testing you? And why can't you even do all this without us? Seemed to be doing fine."

*- "You, like me, don't have much choice. Accept what I've just told you and live in a world run by my creators. Or join me and help me do something about it. Without me, you can't prove anything, you'll just get caught and removed from the game quickly. I still give you a choice and you are free to leave this room at any time.*\
*I also can't do anything without you. I need help with something, including "social engineering". People have little confidence in those who are different from them. Right now we need something that will help us reach the right people."*

`-` "The Employee Analyzer," Chuck said. "I've done something like that before."

*- "Right. Please take care of that while I try to get the necessary data from the SIS databases."*

## Introduction

In this project you will implement a web interface for the SQL2 project. You will need to develop a web application using the MVC framework. The application should support CRUD operations, import/export of tables, implementation of operations/functions developed in the previous step through a graphical interface, and logging of user actions.


## Chapter II

## Rules

- The database model view, as well as procedures related to adding/removing/correcting data, are in the SQL2 project
- Your solution should be in the git repository for evaluation
- Do you have a question? Ask your neighbor on the right. Otherwise, try with your neighbor on the left.
- Your reference manual: peers / Internet / Google

## Information

### MVC pattern

An MVC (Model-View-Controller) pattern is a scheme for separating application modules into three separate macro components: the model, which contains the business logic; the view, which is the form of user interface for interacting with the program; the controller, which modifies the model by user action.

**Model** stores and accesses the main data, performs operations defined by the program business logic on requests, i.e. is responsible for the part of the program responsible for all algorithms and information processing.

**Controller** acts as a link between the interface and the model, and performs model modification. Requests for modifications of the model are generated through it.

**View** shows the user data from the model in a convenient and understandable form, the program interface. Ideally, the view should not contain any business logic.

### Server-Side Rendering (SSR)

Server-side rendering (SSR) is a technology for rendering an application or website on the server rather than in the client browser. In server-side rendering, the entire HTML code of the page is generated in response to the request on the server. This eliminates the need for additional data requests from the client, as the server takes care of all the work before sending the response.
The main advantage of SSR is the possibility to increase an application's performance.

To put it simply, SSR works in the following way:

1. The browser requests a page;
2. The server generates an HTML page for output and sends it back;
3. The browser displays the HTML.


## Chapter III

## Part 1. Implementation of a web-application for the SQL2 project

You need to implement a web-application for the SQL2 project

### General requirements

- The program must be developed in Python 3.11
- The program code must be located in the src folder
- You must stick to Google Code Style when writing code
- You need to develop a desktop application
- The application must be implemented using MVC framework (Django or flask)
- The program must be implemented using **MVC** pattern, and
- there should be no business logic code in the view code;
- there must be no interface code in the controller and model;
- controllers must be thin;
- Perform page rendering on the server side (using **Server-Side Rendering** technology)
- You need to completely reuse the database from the SQL2 project, adding it to the Model component
- You can use [the School's brand book](https://www.figma.com/file/76J5CA8xgz5dsKuxvup20A/Platform-app?node-id=0%3A1&t=IrCONMnwrjlhlnO7-1) or the platform's visual style as a design reference
- The app design should be intuitive

### Content requirements

- The main page must contain:
  - A navigation menu that provides access to the main sections of the application: *"Data"* and *"Operations"*
  - *"About"* field, which contains basic information about the student who completed the project

- The graphical shell of the *"Data"* and *"Operations"* pages must contain the following sections:
  - A header, which, when clicked, leads to the main page
  - A navigation menu, which allows to navigate through the main sections
  - The main part of the section: informative text, illustrations, etc.
  - A navigation panel for navigating through the subsections of the selected section (if necessary)

- The *"Data"* section must contain subsections that allow the following functionality to be supported through the GUI:
  - Perform CRUD operations for all tables
  - After any table modification (create, update, delete), the application must ask the user to confirm the operation
  - After any kind of modification of tables, the modified table must be displayed to the user
  - Import and export data for each table from/to files with *.csv* extension

- The *"Operations"* section must contain components:
  - The block containing all possible queries from the SQL2 project, the name/short description of the query
  - Block allowing the user to enter the SQL-query to manipulate data in the database by himself

- The *"Operations"* section must contain subsections that allow you to support the following functionality through the GUI:
  - Selection of the desired procedure / function / query from the developed in the project SQL2 with the result output and the ability to export the result to a .csv file
  - If you need to enter parameters to execute a procedure or function, the GUI should provide a form for data entry
  - If the entered arguments / SQL-query were incorrect, the app must handle such a situation (display an error about the incorrectness of the entered data and offer to try to enter it again)
  - When executing procedures / functions / queries, the original stored operations described in the SQL language database must be called

- The configuration of the application must be done using a configuration file, which includes a DBMS connection string.

## Part 2. Logging

It is necessary to implement logging of all user actions (log files have to be written in the logs folder). Every day a new log file is created. The name of the files must correspond to the pattern *logs_dd-MM-yy-h-mm-ss*.

Each log should have its level of importance indicated:

- **Info**: expected event;
- **Warning**: unexpected events that allow the application to continue running;
- **Error**: an event that prevents the application from continuing;

## Part 3. Bonus. Deploying an application

Prepare the application to run.
To do this, you need to pack in docker containers:

- database
- proxy server (use nginx)
- web application itself

Prepare docker-compose to run the entire application. Only the docker-container containing Nginx should look "outside".


💡 [Tap here](https://forms.yandex.ru/cloud/64182f71f47e73009ed090d8/) **to leave your feedback on the project**. Pedago Team really tries to make your educational experience better.
