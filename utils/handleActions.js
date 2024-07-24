const inquirer = require('inquirer');
const Department = require(`./department.js`);
const Employee = require(`./employee.js`);
const Questionnaire = require("./questions.js");
const Role = require(`./role.js`);
const Actions = require('./actions.js');
const questionnaire = new Questionnaire();

class HandleActions extends Actions {
    // Call the parent class constructor and initialize exit flag
    constructor() {
        super();
        this.exit = false;
    }

    // Fetch all departments from the database
    async fetchDepartments() {
        const department = new Department();
        return await department.getAllDepartments();
    }

    // Fetch all roles from the database
    async fetchRoles() {
        const role = new Role();
        return await role.getAllRoles();
    }

    // Fetch all employees from the database
    async fetchEmployees() {
        const employee = new Employee();
        return await employee.getAllEmployeesData();
    }

    // Format departments for inquirer prompts
    formattedDepartments(departments) {
        return departments.map(dep => ({
            name: `${dep.name}`,
            value: dep.id
        }));
    }

    // Format employees for inquirer prompts
    formattedEmployees(employees) {
        return employees.map(emp => ({
            name: `${emp.first_name} ${emp.last_name} (ID: ${emp.id})`,
            value: emp.id
        }));
    }

    // Format roles for inquirer prompts
    formattedRoles(roles) {
        return roles.map(role => ({
            name: `${role.title} (ID: ${role.id})`,
            value: role.id
        }));
    }

    // Display all departments in a table format
    async handleViewAllDepartments() {
        const departments = await this.fetchDepartments();
        console.table(departments);
    }

    // Display all roles with their respective departments in a table format
    async handleViewAllRoles() {

        const roles = await this.fetchRoles();
        const departments = await this.fetchDepartments();

        const formatedRoles = roles.map(role => ({
            id: role.id,
            title: role.title,
            department: departments.find(dep => dep.id === role.department).name,
            salary: role.salary
        }));

        console.table(formatedRoles);
    }

    // Display all employees in a table format
    async handleViewAllEmployees() {

        const employees = await this.fetchEmployees();
        console.table(employees);
    }

    // Add a new department to the database
    async handleAddDepartment() {

        const answer = await inquirer.prompt([questionnaire.addDepartment()]);

        const department = new Department();
        await department.addDepartment(answer.name);
    }

    // Add a new role to the database
    async handleAddRole() {

        const departments = await this.fetchDepartments();
        const formattedDepartments = this.formattedDepartments(departments);
        questionnaire.setDepartments(formattedDepartments);
        const answers = await inquirer.prompt(questionnaire.addRole());

        const role = new Role(answers.title, answers.salary, answers.department);
        await role.addRole(role);
    }

    // Add a new employee to the database
    async handleAddEmployee() {

        const roles = await this.fetchRoles();
        const employees = await this.fetchEmployees();

        const formattedRoles = this.formattedRoles(roles);
        const formattedEmployees = this.formattedEmployees(employees);

        questionnaire.setRoles(formattedRoles);
        questionnaire.setEmployees(formattedEmployees);
        const answers = await inquirer.prompt(questionnaire.addEmployee());

        const managerId = answers.manager === 'None' ? null : answers.manager;

        const employee = new Employee(answers.firstName, answers.lastName, answers.role, managerId);
        await employee.addEmployee(employee);
    }

    // Update employee's by choice role or manager
    async handleUpdateEmployee() {

        const employees = await this.fetchEmployees();
        const formattedEmployees = this.formattedEmployees(employees);

        questionnaire.setEmployees(formattedEmployees);
        const employeeAnswer = await inquirer.prompt(questionnaire.updateEmployee());
        const employeeId = employeeAnswer.id;

        if (employeeAnswer.update === 'role') { // Update employee's role in the database

            const roles = await this.fetchRoles();
            const formatedRoles = this.formattedRoles(roles);

            questionnaire.setRoles(formatedRoles);
            const roleAnswer = await inquirer.prompt(questionnaire.updateEmployeeRole());

            const employee = new Employee();
            await employee.updateEmployeeRoleById(employeeId, roleAnswer.role);

        } else if (employeeAnswer.update === 'manager') { // Update employee's manager in the database

            const managers = await this.fetchEmployees();
            const formattedManagers = this.formattedEmployees(managers);

            questionnaire.setEmployees(formattedManagers);
            const managerAnswer = await inquirer.prompt(questionnaire.updateEmployeeManager());

            const managerId = managerAnswer.manager === 'None' ? null : managerAnswer.manager;
            const employee = new Employee();
            await employee.updateEmployeeManagerById(employeeId, managerId);
        }
    }

    // Delete a department from the database
    async handleDeleteDepartment() {

        const departments = await this.fetchDepartments();
        const formattedDepartments = this.formattedDepartments(departments);
        questionnaire.setDepartments(formattedDepartments);
        const answer = await inquirer.prompt(questionnaire.deleteDepartment());

        const department = new Department();
        await department.deleteDepartmentById(answer.departmentId);
    }

    // Delete a role from the database
    async handleDeleteRole() {

        const roles = await this.fetchRoles();
        const formattedRoles = this.formattedRoles(roles);

        questionnaire.setRoles(formattedRoles);
        const answer = await inquirer.prompt(questionnaire.deleteRole());

        const role = new Role();
        await role.deleteRoleById(answer.roleId);
    }

    // Delete an employee from the database
    async handleDeleteEmployee() {

        const employees = await this.fetchEmployees();
        const formattedEmployees = this.formattedEmployees(employees);

        questionnaire.setEmployees(formattedEmployees);
        const answer = await inquirer.prompt(questionnaire.deleteEmployee());

        const employee = new Employee();
        await employee.deleteEmployeeById(answer.employeeId);
    }

    // View employees managed by a specific manager
    async handleViewEmployeesByManager() {
        const employees = await this.fetchEmployees();
        const formattedEmployees = this.formattedEmployees(employees);
        questionnaire.setEmployees(formattedEmployees);
        const answer = await inquirer.prompt(questionnaire.findEmployeeByManager());

        const employee = new Employee();
        const manager = await employee.getEmployeesByManagerId(answer.employeeId);
        if (manager.length > 0) {
            console.table(manager);
        } else {
            console.log(`The current manager has no employees`)
        }
    }

    // View employees by department
    async handleViewEmployeesByDepartment() {
        const departments = await this.fetchDepartments();
        const formattedDepartments = this.formattedDepartments(departments);

        questionnaire.setDepartments(formattedDepartments);

        const answer = await inquirer.prompt(questionnaire.findEmployeesByDepartment());

        const department = new Department();
        const employees = await department.getEmployeesByDepartmentId(answer.departmentId);
        if (employees.length > 0) {
            console.table(employees);
        } else {
            console.log(`The current department has no employees`)
        }
    }

    // View the budget of a department
    async handleViewBudgetDepartment() {
        const departments = await this.fetchDepartments();
        const formattedDepartments = this.formattedDepartments(departments);
        questionnaire.setDepartments(formattedDepartments);

        const answer = await inquirer.prompt(questionnaire.findBudgetByDepartment());

        const department = new Department();
        const budget = await department.getBudgetDepartmentById(answer.departmentId);
        if (budget.length > 0) {
            console.table(budget);
        } else {
            console.log(`The current department has no employees`);
        }
    }

    // Map actions to their corresponding handler methods
    actions() {
        return {
            [this.VIEW_ALL_EMPLOYEES]: () => this.handleViewAllEmployees(),
            [this.VIEW_EMPLOYEES_BY_MANAGER]: () => this.handleViewEmployeesByManager(),
            [this.ADD_EMPLOYEE]: () => this.handleAddEmployee(),
            [this.UPDATE_EMPLOYEE]: () => this.handleUpdateEmployee(),
            [this.DELETE_EMPLOYEE]: () => this.handleDeleteEmployee(),
            [this.VIEW_ALL_ROLES]: () => this.handleViewAllRoles(),
            [this.ADD_ROLE]: () => this.handleAddRole(),
            [this.DELETE_ROLE]: () => this.handleDeleteRole(),
            [this.VIEW_ALL_DEPARTMENTS]: () => this.handleViewAllDepartments(),
            [this.VIEW_EMPLOYEES_BY_DEPARTMENT]: () => this.handleViewEmployeesByDepartment(),
            [this.VIEW_BUDGET_DEPARTMENT]: () => this.handleViewBudgetDepartment(),
            [this.ADD_DEPARTMENT]: () => this.handleAddDepartment(),
            [this.DELETE_DEPARTMENT]: () => this.handleDeleteDepartment(),
            [this.QUIT]: () => { this.exit = true; }
        };
    }

}

module.exports = HandleActions;