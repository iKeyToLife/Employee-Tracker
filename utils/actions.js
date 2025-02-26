class Actions {
    constructor() {
        // Define various action constants
        this.VIEW_ALL_EMPLOYEES = 'View All Employees';
        this.VIEW_EMPLOYEES_BY_MANAGER = 'View Employees by manager'
        this.ADD_EMPLOYEE = 'Add Employee';
        this.UPDATE_EMPLOYEE = 'Update Employee';
        this.DELETE_EMPLOYEE = 'Delete Employee';
        this.VIEW_ALL_ROLES = 'View All Roles';
        this.ADD_ROLE = 'Add Role';
        this.DELETE_ROLE = 'Delete Role';
        this.VIEW_ALL_DEPARTMENTS = 'View All departments';
        this.VIEW_EMPLOYEES_BY_DEPARTMENT = 'View employees by department';
        this.VIEW_BUDGET_DEPARTMENT = 'View department budget';
        this.ADD_DEPARTMENT = 'Add Department';
        this.DELETE_DEPARTMENT = 'Delete Department';
        this.QUIT = 'Quit';
    }
}

module.exports = Actions;