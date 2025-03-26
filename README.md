# Employee Tracker Challenge

## Description
This is a command-line interface (CLI) application built using Node.js, Inquirer, and PostgreSQL that enables a business owner to manage departments, roles, and employees in a company database.

## Video Walkthrough
🎥 [Click here to watch the walkthrough video](https://drive.google.com/file/d/1JmtzbbQDS4yYqn-4LGa7buELOuJCHJn-/view?usp=sharing)

## Installation
```sh
npm install inquirer@8.2.4 pg dotenv
```

## Usage
1. Start PostgreSQL: `brew services start postgresql@14`
2. Create the database:
```sh
psql -U postgres -d postgres
CREATE DATABASE employee_tracker;
\q
```
3. Create tables and seed data:
```sh
psql -U postgres -d employee_tracker -f db/schema.sql
psql -U postgres -d employee_tracker -f db/seeds.sql
```
4. Run the application:
```sh
node index.js
```

## Features
- View all departments, roles, and employees
- Add a department
- Add a role
- Add an employee
- Update an employee's role

## Project Structure
```
Employee-Tracker/
│── db/
│   ├── schema.sql
│   └── seeds.sql
│── index.js
│── .env
│── package.json
│── README.md