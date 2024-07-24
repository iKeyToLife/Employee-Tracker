require('dotenv').config();
const pool = require(`./db/config.js`);
const inquirer = require('inquirer');
const Questionnaire = require('./utils/questions.js');
const HandleActions = require(`./utils/handleActions.js`);

// Connects to the database and logs a message to the console on success or error
pool.connect()
    .then(() => console.log('Connected to the database.'))
    .catch(err => console.error('Connection error:', err.stack));

const questionnaire = new Questionnaire();

// Prompts the user with a question and waits for their response
async function mainMenu() {
    const answer = await inquirer.prompt([questionnaire.toDoChoice()]);
    return answer.choice;
}

async function init() {
    const handleActions = new HandleActions();
    try {

        // Gets the action handlers from the HandleActions instance
        const actionHandlers = handleActions.actions()

        while (!handleActions.exit) {
            // Waits for the user's choice from the main menu
            const choice = await mainMenu();

            // Executes the action corresponding to the user's choice
            await actionHandlers[choice]();
        }
        console.log('Exiting...');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Closes the database connection
        pool.end();
        // Exits the process
        process.exit(0);
    }
}

init();
