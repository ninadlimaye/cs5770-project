# CS5770 Final Project
Kaelan Cooter & Ninad Limaye

# Automatic SQL Injection Vulnerability Detection

A simple single page application is created using Node.js/Express and SQLite and a tool script is developed to intercept xhr requests and replay them with changed parameters with sql injection attacks appended to them. It's passive detection which runs in the background. And, it will let us know if there is indeed a (simple) SQL injection vulnerability.

# Framework

* Node.js as the core app engine (latest version)
* Express.js as the web framework
* node-sqlite3 as the database API
* Some basic DDL/DML

# Running the application

1. Clone the repository on your machine and navigate to the main directory.
2. Before running the application, make sure that you have node.js and sqlite3 installed in your system.
3. We need to install several dependencies by entering "npm install".
4. The "npm start" command will run the server. Go to localhost:3000 in any web browser.
5. Use the form to add new users. Users will appear below the form. Click on user names to perform a request to get more data. This endpoint is vulnerable.
6. Run `window.findVulnerabilities()` to retry GET requests that might be vulnerable. The script will make another request that will change the output if its vulnerable. If the status code changed, it's possible that there was a malformed SQL query on the server side that threw and error. If the status code is 200 and the data has changed, then it's possible that the hacked SQL query succeeded and changed the output. Currently all query parameters are tried.


# Presentation
https://docs.google.com/presentation/d/1IfuyUzLcH5Ot2WpGock23nbaK9LaEPy6tOf-dZheka4/edit?usp=sharing
