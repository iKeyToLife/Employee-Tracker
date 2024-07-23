require('dotenv').config();
const pool = require(`./db/config.js`);
const inquirer = require('inquirer');
const Questionnaire = require('./utils/questions.js');
const HandleActions = require(`./utils/handleActions.js`)

pool.connect()
    .then(() => console.log('Connected to the database.'))
    .catch(err => console.error('Connection error:', err.stack));

const questionnaire = new Questionnaire();

async function mainMenu() {

    const answer = await inquirer.prompt([questionnaire.toDoChoice()]);
    return answer.choice;
}

async function init() {
    const handleActions = new HandleActions();
    try {
        let isUpdate = false;
        const departments = await handleActions.fetchDepartments(isUpdate);
        const roles = await handleActions.fetchRoles(isUpdate);
        const employees = await handleActions.fetchEmployees(isUpdate);
        questionnaire.setDepartments(departments);
        questionnaire.setRoles(roles);
        questionnaire.setEmployees(employees);

        const actionHandlers = handleActions.actions()

        while (!handleActions.exit) {
            const choice = await mainMenu();
            await actionHandlers[choice]();
        }
        console.log('Exiting...');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
        process.exit(0);
    }
}

init();
