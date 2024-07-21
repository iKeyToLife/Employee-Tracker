INSERT INTO department (name) VALUES
('Human Resources'),
('Engineering'),
('Sales');

INSERT INTO role (title, salary, department) VALUES
('HR Manager', 60000, (SELECT id FROM department WHERE name = 'Human Resources')),
('Software Engineer', 80000, (SELECT id FROM department WHERE name = 'Engineering')),
('Sales Representative', 50000, (SELECT id FROM department WHERE name = 'Sales'));

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', (SELECT id FROM role WHERE title = 'HR Manager'), NULL),
('Jane', 'Smith', (SELECT id FROM role WHERE title = 'Software Engineer'), (SELECT id FROM employee WHERE first_name = 'John' AND last_name = 'Doe')),
('Emily', 'Jones', (SELECT id FROM role WHERE title = 'Sales Representative'), (SELECT id FROM employee WHERE first_name = 'John' AND last_name = 'Doe')),
('Michael', 'Brown', (SELECT id FROM role WHERE title = 'Software Engineer'), (SELECT id FROM employee WHERE first_name = 'Jane' AND last_name = 'Smith'));
