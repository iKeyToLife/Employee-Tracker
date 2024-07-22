require('dotenv').config();
const pool = require(`./db/config.js`);
const Department = require(`./utils/department.js`);
const Employee = require(`./utils/employee.js`);
const Role = require(`./utils/role.js`);
const inquirer = require('inquirer');
const Questionnaire = require('./utils/questions.js');

const questionnaire = new Questionnaire();


pool.connect()
    .then(() => console.log('Connected to the database.'))
    .catch(err => console.error('Connection error:', err.stack));

async function fetchDepartments(isUpdate) {

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

async function fetchRoles(isUpdate) {

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

async function fetchEmployees(isUpdate) {

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

async function handleViewAllDepartments(isUpdate) {
    const departments = await fetchDepartments(isUpdate);
    console.table(departments);
}

async function handleViewAllRoles(isUpdate) {

    const roles = await fetchRoles(isUpdate);
    const departments = await fetchDepartments(isUpdate);

    const formatedRoles = roles.map(role => ({
        id: role.id,
        title: role.title,
        department: departments.find(dep => dep.id === role.department).name,
        salary: role.salary
    }));

    console.table(formatedRoles);
}

async function handleViewAllEmployees(isUpdate) {

    const employees = await fetchEmployees(isUpdate);
    console.table(employees);
}

async function mainMenu() {

    const answer = await inquirer.prompt([questionnaire.toDoChoice()]);
    return answer.choice;
}

async function handleAddDepartment() {

    const answer = await inquirer.prompt([questionnaire.addDepartment()]);

    const department = new Department();
    await department.addDepartment(answer.name);
}

async function handleAddRole(isUpdate) {

    const departments = await fetchDepartments(isUpdate);

    questionnaire.setDepartments(departments);
    const answers = await inquirer.prompt(questionnaire.addRole());

    const role = new Role(answers.title, answers.salary, answers.department);
    await role.addRole(role);
}

async function handleAddEmployee(isUpdate) {

    const roles = await fetchRoles(isUpdate);
    const employees = await fetchEmployees(isUpdate);

    questionnaire.setRoles(roles);
    questionnaire.setEmployees(employees);
    const answers = await inquirer.prompt(questionnaire.addEmployee());

    const managerId = answers.manager === 'None' ? null : answers.manager;

    const employee = new Employee(answers.firstName, answers.lastName, answers.role, managerId);
    await employee.addEmployee(employee);
}

async function handleUpdateEmployee(isUpdate) {

    const employees = await fetchEmployees(isUpdate);

    questionnaire.setEmployees(employees);
    const employeeAnswer = await inquirer.prompt(questionnaire.updateEmployee());
    const employeeId = employeeAnswer.id;

    if (employeeAnswer.update === 'role') {

        const roles = await fetchRoles(isUpdate);
        questionnaire.setRoles(roles);
        const roleAnswer = await inquirer.prompt(questionnaire.updateEmployeeRole());

        const employee = new Employee();
        await employee.updateEmployeeRoleById(employeeId, roleAnswer.role);

    } else if (employeeAnswer.update === 'manager') {

        const managers = await fetchEmployees(isUpdate);
        questionnaire.setEmployees(managers);
        const managerAnswer = await inquirer.prompt(questionnaire.updateEmployeeManager());

        const managerId = managerAnswer.manager === 'None' ? null : managerAnswer.manager;
        const employee = new Employee();
        await employee.updateEmployeeManagerById(employeeId, managerId);
    }
}

async function handleDeleteDepartment(isUpdate) {

    const departments = await fetchDepartments(isUpdate);

    questionnaire.setDepartments(departments);
    const answer = await inquirer.prompt(questionnaire.deleteDepartment());

    const department = new Department();
    await department.deleteDepartmentById(answer.departmentId);
}

async function handleDeleteRole(isUpdate) {

    const roles = await fetchRoles(isUpdate);
    questionnaire.setRoles(roles);
    const answer = await inquirer.prompt(questionnaire.deleteRole());

    const role = new Role();
    await role.deleteRoleById(answer.roleId);
}

async function handleDeleteEmployee(isUpdate) {

    const employees = await fetchEmployees(isUpdate);
    questionnaire.setEmployees(employees);
    const answer = await inquirer.prompt(questionnaire.deleteEmployee());

    const employee = new Employee();
    await employee.deleteEmployeeById(answer.employeeId);
}

async function init() {
    try {
        let isUpdate = false;
        const departments = await fetchDepartments(isUpdate);
        const roles = await fetchRoles(isUpdate);
        const employees = await fetchEmployees(isUpdate);
        questionnaire.setDepartments(departments);
        questionnaire.setRoles(roles);
        questionnaire.setEmployees(employees);

        let exit = false;

        while (!exit) {
            const choice = await mainMenu();
            switch (choice) {
                case 'View All Employees':
                    await handleViewAllEmployees(isUpdate);
                    break;
                case 'Add Employee':
                    await handleAddEmployee(!isUpdate);
                    break;
                case 'Update Employee':
                    await handleUpdateEmployee(!isUpdate);
                    break;
                case 'Delete Employee':
                    await handleDeleteEmployee(!isUpdate);
                    break;
                case 'View All Roles':
                    await handleViewAllRoles(isUpdate);
                    break;
                case 'Add Role':
                    await handleAddRole(!isUpdate);
                    break;
                case 'Delete Role':
                    await handleDeleteRole(!isUpdate);
                    break;
                case 'View All Departments':
                    await handleViewAllDepartments(isUpdate);
                    break;
                case 'Add Department':
                    await handleAddDepartment();
                    break;
                case 'Delete Department':
                    await handleDeleteDepartment(!isUpdate);
                    break;
                case 'Quit':
                    exit = true;
                    break;
                default:
                    console.log('Option not implemented yet.');
                    break;
            }
        }
        console.log('Exiting...');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
    }
}

init();
