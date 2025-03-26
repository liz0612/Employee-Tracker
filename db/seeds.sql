INSERT INTO department (name) VALUES
('Engineering'),
('Sales'),
('HR');

INSERT INTO role (title, salary, department_id) VALUES
('Software Engineer', 90000, 1),
('Sales Manager', 60000, 2),
('HR Manager', 65000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Alice', 'Smith', 1, NULL),
('Bob', 'Brown', 2, 1),
('Charlie', 'Davis', 3, 1);