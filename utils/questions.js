const Actions = require(`./actions`);
const actions = new Actions();

class Questionnaire {

    // Initializes empty arrays for departments, roles, and employees
    constructor() {
        this.departments = [];
        this.roles = [];
        this.employees = [];
    }

    // Sets the departments array
    setDepartments(departments) {
        this.departments = departments;
    }

    // Sets the roles array
    setRoles(roles) {
        this.roles = roles;
    }

    // Sets the employees array
    setEmployees(employees) {
        this.employees = employees;
    }

    // Returns a question object for the main menu with a list of choices
    toDoChoice() {
        return {
            message: `What would you like to do?`,
            name: `choice`,
            type: `list`,
            choices: [actions.VIEW_ALL_EMPLOYEES,
            actions.VIEW_EMPLOYEES_BY_MANAGER,
            actions.ADD_EMPLOYEE,
            actions.UPDATE_EMPLOYEE,
            actions.DELETE_EMPLOYEE,
            actions.VIEW_ALL_ROLES,
            actions.ADD_ROLE,
            actions.DELETE_ROLE,
            actions.VIEW_ALL_DEPARTMENTS,
            actions.VIEW_EMPLOYEES_BY_DEPARTMENT,
            actions.VIEW_BUDGET_DEPARTMENT,
            actions.ADD_DEPARTMENT,
            actions.DELETE_DEPARTMENT,
            actions.QUIT]
        };
    }

    // Returns a question object to add a department
    addDepartment() {
        return {
            message: `What is the name of department?`,
            name: `name`
        }
    }

    // Returns a question object to delete a department
    deleteDepartment() {
        return [
            {
                type: 'list',
                name: 'departmentId',
                message: 'Which department do you want to delete?',
                choices: this.departments
            }
        ]
    }

    // Returns an array of question objects to add a role
    addRole() {
        return [{
            message: `What is the name of the role?`,
            name: `title`
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

    // Returns a question object to delete a role
    deleteRole() {
        return [
            {
                type: 'list',
                name: 'roleId',
                message: 'Which role do you want to delete?',
                choices: this.roles
            }
        ]
    }

    // Returns an array of question objects to add an employee
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

    // Returns an array of question objects to update an employee
    updateEmployee() {
        return [{
            message: `Which employee do you want to update?`,
            name: `id`,
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

    // Returns a question object to update an employee's role
    updateEmployeeRole() {
        return [{
            message: `Which role do you want to assign the selected employee?`,
            name: `role`,
            type: `list`,
            choices: this.roles
        }]
    }

    // Returns a question object to update an employee's manager
    updateEmployeeManager() {
        return [{
            message: `Which manager do you want to assign to the selected employee?`,
            name: `manager`,
            type: `list`,
            choices: [`None`, ...this.employees]
        }]
    }

    // Returns a question object to delete an employee
    deleteEmployee() {
        return [
            {
                type: 'list',
                name: 'employeeId',
                message: 'Which employee do you want to delete?',
                choices: this.employees
            }
        ];
    }

    // Returns a question object to find employees by manager
    findEmployeeByManager() {
        return [
            {
                type: 'list',
                name: 'employeeId',
                message: 'Which manager do you want to see employees by?',
                choices: this.employees
            }
        ];
    }

    // Returns a question object to find employees by department
    findEmployeesByDepartment() {
        return [
            {
                type: 'list',
                name: 'departmentId',
                message: 'Which department employees would you like to see?',
                choices: this.departments
            }
        ];
    }

    // Returns a question object to find the budget by department
    findBudgetByDepartment() {
        return [
            {
                type: 'list',
                name: 'departmentId',
                message: 'Which department budget would you like to see?',
                choices: this.departments
            }
        ];
    }
}

module.exports = Questionnaire;