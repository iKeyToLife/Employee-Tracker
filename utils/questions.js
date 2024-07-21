class Questionnaire {
    constructor() {
        this.departments = [];
        this.roles = [];
        this.employees = [];
    }

    setDepartments(departments) {
        this.departments = departments;
    }

    setRoles(roles) {
        this.roles = roles;
    }

    setEmployees(employees) {
        this.employees = employees;
    }

    toDoChoice() {
        return {
            message: `What would you like to do?`,
            name: `choice`,
            type: `list`,
            choices: [`View All Employees`, `Add Employee`, `Update Employee`, `View All Roles`, `Add Role`, `View All Departments`, `Add Department`, `Quit`]
        };
    }
    addDepartment() {
        return {
            message: `What is the name of department?`,
            name: `name`
        }
    }

    addRole() {
        return [{
            message: `What is the name of the role?`,
            name: `name`
        },
        {
            message: `What is the salary of the role?`,
            name: `salary`
        },
        {
            message: `Which department does the role belong to?`,
            name: `department`,
            type: `list`,
            choices: this.departments
        }
        ]
    }

    addEmployee() {
        return [{
            message: `What is the employee's first name?`,
            name: `firstName`
        },
        {
            message: `What is the employee's last name?`,
            name: `lastName`
        },
        {
            message: `What is the employee's role?`,
            name: `role`,
            type: `list`,
            choices: this.roles
        },
        {
            message: `Who is the employee's manager?`,
            name: `manager`,
            type: `list`,
            choices: [`None`, ...this.employees]
        }]
    }

    updateEmployee() {
        [{
            message: `Which employee do you want to update?`,
            name: `name`,
            type: `list`,
            choices: this.employees
        },
        {
            message: `What do you want to update in an employee?`,
            name: `update`,
            type: `list`,
            choices: [`role`, `manager`]
        }]
    }

    updateEmployeeRole() {
        return [{
            message: `Which role do you want to assign the selected employee?`,
            name: `role`,
            type: `list`,
            choices: this.roles
        }]
    }

    updateEmployeeManager() {
        return [{
            message: `Which manager do you want to assign to the selected employee?`,
            name: `manager`,
            type: `list`,
            choices: [`None`, ...this.employees]
        }]
    }
}

