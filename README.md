# Employee-Tracker

## Table of Contents
- [Description](#description)
- [User Story](#user-story)
- [Acceptance Criteria](#acceptance-criteria)
- [Mock-Up](#mock-up)
- [Installation](#installation)
- [Usage](#usage)
- [Key Features](#key-features)
- [Technologies](#technologies)
- [Repository Link](#repository-link)
- [Deployed Application](#deployed-application)

## Description
This is a command-line application for managing a company's employee database. It allows users to view and manage departments, roles, and employees. The application is built using Node.js, Inquirer, and PostgreSQL. It provides a convenient interface for business users to organize and plan their activities.

## User Story

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Acceptance Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```

## Mock-Up

The following video shows an example of the application being used from the command line:

[![A video thumbnail shows the command-line employee management application with a play button overlaying the view.](./assets/preview-video.png)](https://2u-20.wistia.com/medias/2lnle7xnpk)

## Installation

To install the application, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
2. Navigate to the project directory:
   ```bash
   cd <project-directory>
3. Install the dependencies:
   ```bash
   npm install
4. Create a PostgreSQL database and configure the connection settings in the configuration file.

## Usage

1. Run the command-line application:
   ```bash
   npm start
2. Follow the on-screen prompts to interact with the employee database.

## Key Features

1.  View All Departments
    - Displays a formatted table with department names and IDs.

2. View All Roles
    - Displays a table with job titles, role IDs, departments, and salaries.

3. View All Employees
    - Displays a table with employee IDs, first names, last names, job titles, departments, salaries, and managers.

4. Add Department
    - Prompts for the name of a new department and adds it to the database.

5. Add Role
    - Prompts for the title, salary, and department of a new role and adds it to the database.

6. Add Employee
    - Prompts for the first name, last name, role, and manager of a new employee and adds them to the database.

7. Update Employee Role
    - Prompts to select an employee and update their role in the database.

8. Update Employee Managers
    - Allows users to update the managers of employees.

9. View Employees by Manager
    - Displays employees categorized by their managers.

10. View Employees by Department
    - Displays employees categorized by their departments.

11. Delete Departments, Roles, and Employees
    - Allows users to delete departments, roles, and employees from the database.

12. View Department Budget
    - Displays the total utilized budget of a department, which is the combined salaries of all employees in that department.

## Technologies

- Node.js - runtime environment.
- Inquirer 8.2.4 - for interactive command-line prompts.
- PostgreSQL - relational database.
- pg - PostgreSQL client for Node.js.
- dotenv - for managing environment variables.

## Repository Link
[Employee Tracker Repository](https://github.com/iKeyToLife/Employee-Tracker)

## Deployed Application
[Employee Tracker Application]()