const inquirer = require('inquirer');
const Department = require(`./department.js`);
const Employee = require(`./employee.js`);
const Questionnaire = require("./questions.js");
const Role = require(`./role.js`);
const Actions = require('./actions.js');
const questionnaire = new Questionnaire();

class HandleActions extends Actions {
    constructor() {
        super();
        this.exit = false;
    }
    async fetchDepartments() {
        const department = new Department();
        return await department.getAllDepartments();
    }

    async fetchRoles() {
        const role = new Role();
        return await role.getAllRoles();
    }

    async fetchEmployees() {
        const employee = new Employee();
        return await employee.getAllEmployeesData();
    }

    formattedDepartments(departments) {
        return departments.map(dep => ({
            name: `${dep.name}`,
            id: dep.id,
            value: dep.id
        }));
    }

    formattedEmployees(employees) {
        return employees.map(emp => ({
            name: `${emp.first_name} ${emp.last_name} (ID: ${emp.id})`,
            value: emp.id
        }));
    }

    formatedRoles(roles) {
        return roles.map(role => ({
            name: `${role.title} (ID: ${role.id})`,
            value: role.id
        }));
    }

    async handleViewAllDepartments() {
        const departments = await this.fetchDepartments();
        console.table(departments);
    }

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

    async handleViewAllEmployees() {

        const employees = await this.fetchEmployees();
        console.table(employees);
    }

    async handleAddDepartment() {

        const answer = await inquirer.prompt([questionnaire.addDepartment()]);

        const department = new Department();
        await department.addDepartment(answer.name);
    }

    async handleAddRole() {

        const departments = await this.fetchDepartments();
        const formattedDepartments = this.formattedDepartments(departments);
        questionnaire.setDepartments(formattedDepartments);
        const answers = await inquirer.prompt(questionnaire.addRole());

        const role = new Role(answers.title, answers.salary, answers.department);
        await role.addRole(role);
    }

    async handleAddEmployee() {

        const roles = await this.fetchRoles();
        const employees = await this.fetchEmployees();

        const formatedRoles = this.formatedRoles(roles);
        const formattedEmployees = this.formattedEmployees(employees);

        questionnaire.setRoles(formatedRoles);
        questionnaire.setEmployees(formattedEmployees);
        const answers = await inquirer.prompt(questionnaire.addEmployee());

        const managerId = answers.manager === 'None' ? null : answers.manager;

        const employee = new Employee(answers.firstName, answers.lastName, answers.role, managerId);
        await employee.addEmployee(employee);
    }

    async handleUpdateEmployee() {

        const employees = await this.fetchEmployees();
        const formattedEmployees = this.formattedEmployees(employees);

        questionnaire.setEmployees(formattedEmployees);
        const employeeAnswer = await inquirer.prompt(questionnaire.updateEmployee());
        const employeeId = employeeAnswer.id;

        if (employeeAnswer.update === 'role') {

            const roles = await this.fetchRoles();
            const formatedRoles = this.formatedRoles(roles);

            questionnaire.setRoles(formatedRoles);
            const roleAnswer = await inquirer.prompt(questionnaire.updateEmployeeRole());

            const employee = new Employee();
            await employee.updateEmployeeRoleById(employeeId, roleAnswer.role);

        } else if (employeeAnswer.update === 'manager') {

            const managers = await this.fetchEmployees();
            const formattedManagers = this.formattedEmployees(managers);

            questionnaire.setEmployees(formattedManagers);
            const managerAnswer = await inquirer.prompt(questionnaire.updateEmployeeManager());

            const managerId = managerAnswer.manager === 'None' ? null : managerAnswer.manager;
            const employee = new Employee();
            await employee.updateEmployeeManagerById(employeeId, managerId);
        }
    }

    async handleDeleteDepartment() {

        const departments = await this.fetchDepartments();
        const formattedDepartments = this.formattedDepartments(departments);
        questionnaire.setDepartments(formattedDepartments);
        const answer = await inquirer.prompt(questionnaire.deleteDepartment());

        const department = new Department();
        await department.deleteDepartmentById(answer.departmentId);
    }

    async handleDeleteRole() {

        const roles = await this.fetchRoles();
        const formatedRoles = this.formatedRoles(roles);

        questionnaire.setRoles(formatedRoles);
        const answer = await inquirer.prompt(questionnaire.deleteRole());

        const role = new Role();
        await role.deleteRoleById(answer.roleId);
    }

    async handleDeleteEmployee() {

        const employees = await this.fetchEmployees();
        const formattedEmployees = this.formattedEmployees(employees);

        questionnaire.setEmployees(formattedEmployees);
        const answer = await inquirer.prompt(questionnaire.deleteEmployee());

        const employee = new Employee();
        await employee.deleteEmployeeById(answer.employeeId);
    }

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
            [this.ADD_DEPARTMENT]: () => this.handleAddDepartment(),
            [this.DELETE_DEPARTMENT]: () => this.handleDeleteDepartment(),
            [this.QUIT]: () => { this.exit = true; }
        };
    }

}

module.exports = HandleActions;