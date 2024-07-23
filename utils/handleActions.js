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
    async fetchDepartments(isUpdate) {

        const department = new Department();
        const departments = await department.getAllDepartments();

        if (!isUpdate) {
            return departments;
        } else {
            return departments.map(dep => ({
                name: `${dep.name}`,
                id: dep.id,
                value: dep.id
            }));
        }
    }

    async fetchRoles(isUpdate) {

        const role = new Role();
        const roles = await role.getAllRoles();

        if (!isUpdate) {
            return roles;
        } else {
            return roles.map(role => ({
                name: `${role.title} (ID: ${role.id})`,
                value: role.id
            }));
        }
    }

    async fetchEmployees(isUpdate) {

        const employee = new Employee();
        const employees = await employee.getAllEmployeesData();

        if (!isUpdate) {
            return employees;
        } else {
            return employees.map(emp => ({
                name: `${emp.first_name} ${emp.last_name} (ID: ${emp.id})`,
                value: emp.id
            }));
        }
    }

    async handleViewAllDepartments(isUpdate) {
        const departments = await this.fetchDepartments(isUpdate);
        console.table(departments);
    }

    async handleViewAllRoles(isUpdate) {

        const roles = await this.fetchRoles(isUpdate);
        const departments = await this.fetchDepartments(isUpdate);

        const formatedRoles = roles.map(role => ({
            id: role.id,
            title: role.title,
            department: departments.find(dep => dep.id === role.department).name,
            salary: role.salary
        }));

        console.table(formatedRoles);
    }

    async handleViewAllEmployees(isUpdate) {

        const employees = await this.fetchEmployees(isUpdate);
        console.table(employees);
    }

    async handleAddDepartment() {

        const answer = await inquirer.prompt([questionnaire.addDepartment()]);

        const department = new Department();
        await department.addDepartment(answer.name);
    }

    async handleAddRole(isUpdate) {

        const departments = await this.fetchDepartments(isUpdate);

        questionnaire.setDepartments(departments);
        const answers = await inquirer.prompt(questionnaire.addRole());

        const role = new Role(answers.title, answers.salary, answers.department);
        await role.addRole(role);
    }

    async handleAddEmployee(isUpdate) {

        const roles = await this.fetchRoles(isUpdate);
        const employees = await this.fetchEmployees(isUpdate);

        questionnaire.setRoles(roles);
        questionnaire.setEmployees(employees);
        const answers = await inquirer.prompt(questionnaire.addEmployee());

        const managerId = answers.manager === 'None' ? null : answers.manager;

        const employee = new Employee(answers.firstName, answers.lastName, answers.role, managerId);
        await employee.addEmployee(employee);
    }

    async handleUpdateEmployee(isUpdate) {

        const employees = await this.fetchEmployees(isUpdate);

        questionnaire.setEmployees(employees);
        const employeeAnswer = await inquirer.prompt(questionnaire.updateEmployee());
        const employeeId = employeeAnswer.id;

        if (employeeAnswer.update === 'role') {

            const roles = await this.fetchRoles(isUpdate);
            questionnaire.setRoles(roles);
            const roleAnswer = await inquirer.prompt(questionnaire.updateEmployeeRole());

            const employee = new Employee();
            await employee.updateEmployeeRoleById(employeeId, roleAnswer.role);

        } else if (employeeAnswer.update === 'manager') {

            const managers = await this.fetchEmployees(isUpdate);
            questionnaire.setEmployees(managers);
            const managerAnswer = await inquirer.prompt(questionnaire.updateEmployeeManager());

            const managerId = managerAnswer.manager === 'None' ? null : managerAnswer.manager;
            const employee = new Employee();
            await employee.updateEmployeeManagerById(employeeId, managerId);
        }
    }

    async handleDeleteDepartment(isUpdate) {

        const departments = await this.fetchDepartments(isUpdate);

        questionnaire.setDepartments(departments);
        const answer = await inquirer.prompt(questionnaire.deleteDepartment());

        const department = new Department();
        await department.deleteDepartmentById(answer.departmentId);
    }

    async handleDeleteRole(isUpdate) {

        const roles = await this.fetchRoles(isUpdate);
        questionnaire.setRoles(roles);
        const answer = await inquirer.prompt(questionnaire.deleteRole());

        const role = new Role();
        await role.deleteRoleById(answer.roleId);
    }

    async handleDeleteEmployee(isUpdate) {

        const employees = await this.fetchEmployees(isUpdate);
        questionnaire.setEmployees(employees);
        const answer = await inquirer.prompt(questionnaire.deleteEmployee());

        const employee = new Employee();
        await employee.deleteEmployeeById(answer.employeeId);
    }

    actions() {
        let isUpdate = false;
        return {
            [this.VIEW_ALL_EMPLOYEES]: () => this.handleViewAllEmployees(isUpdate),
            [this.ADD_EMPLOYEE]: () => this.handleAddEmployee(!isUpdate),
            [this.UPDATE_EMPLOYEE]: () => this.handleUpdateEmployee(!isUpdate),
            [this.DELETE_EMPLOYEE]: () => this.handleDeleteEmployee(!isUpdate),
            [this.VIEW_ALL_ROLES]: () => this.handleViewAllRoles(isUpdate),
            [this.ADD_ROLE]: () => this.handleAddRole(!isUpdate),
            [this.DELETE_ROLE]: () => this.handleDeleteRole(!isUpdate),
            [this.VIEW_ALL_DEPARTMENTS]: () => this.handleViewAllDepartments(isUpdate),
            [this.ADD_DEPARTMENT]: () => this.handleAddDepartment(),
            [this.DELETE_DEPARTMENT]: () => this.handleDeleteDepartment(!isUpdate),
            [this.QUIT]: () => { this.exit = true; }
        };
    }

}

module.exports = HandleActions;