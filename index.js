const inquirer = require('inquirer');
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

client.connect();

const startApp = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        }
    ]).then((answer) => {
        switch (answer.action) {
            case 'View all departments': return viewDepartments();
            case 'View all roles': return viewRoles();
            case 'View all employees': return viewEmployees();
            case 'Add a department': return addDepartment();
            case 'Add a role': return addRole();
            case 'Add an employee': return addEmployee();
            case 'Update an employee role': return updateEmployeeRole();
            case 'Exit':
                client.end();
                console.log('Goodbye!');
        }
    });
};

const viewDepartments = async () => {
    const res = await client.query('SELECT * FROM department');
    console.table(res.rows);
    startApp();
};

const viewRoles = async () => {
    const res = await client.query(`
        SELECT role.id, role.title, department.name AS department, role.salary
        FROM role
        JOIN department ON role.department_id = department.id`);
    console.table(res.rows);
    startApp();
};

const viewEmployees = async () => {
    const res = await client.query(`
        SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary,
        m.first_name AS manager
        FROM employee e
        LEFT JOIN role r ON e.role_id = r.id
        LEFT JOIN department d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id`);
    console.table(res.rows);
    startApp();
};

const addDepartment = async () => {
    const answer = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:'
    });
    await client.query('INSERT INTO department (name) VALUES ($1)', [answer.name]);
    console.log('Department added!');
    startApp();
};

const addRole = async () => {
    const departments = await client.query('SELECT * FROM department');
    const answer = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'Enter the role title:' },
        { type: 'input', name: 'salary', message: 'Enter the role salary:' },
        {
            type: 'list',
            name: 'department_id',
            message: 'Select a department:',
            choices: departments.rows.map(dept => ({ name: dept.name, value: dept.id }))
        }
    ]);
    await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answer.title, answer.salary, answer.department_id]);
    console.log('Role added!');
    startApp();
};

const addEmployee = async () => {
    const roles = await client.query('SELECT * FROM role');
    const employees = await client.query('SELECT * FROM employee');

    const answer = await inquirer.prompt([
        { type: 'input', name: 'first_name', message: 'First name:' },
        { type: 'input', name: 'last_name', message: 'Last name:' },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select a role:',
            choices: roles.rows.map(role => ({ name: role.title, value: role.id }))
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Select a manager:',
            choices: [{ name: 'None', value: null }, ...employees.rows.map(emp => ({ name: emp.first_name + ' ' + emp.last_name, value: emp.id }))]
        }
    ]);

    await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answer.first_name, answer.last_name, answer.role_id, answer.manager_id]);
    console.log('Employee added!');
    startApp();
};

const updateEmployeeRole = async () => {
    const employees = await client.query('SELECT * FROM employee');
    const roles = await client.query('SELECT * FROM role');

    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Select an employee to update:',
            choices: employees.rows.map(emp => ({ name: emp.first_name + ' ' + emp.last_name, value: emp.id }))
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the new role:',
            choices: roles.rows.map(role => ({ name: role.title, value: role.id }))
        }
    ]);

    await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answer.role_id, answer.employee_id]);
    console.log('Employee role updated!');
    startApp();
};

startApp();