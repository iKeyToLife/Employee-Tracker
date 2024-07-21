require('dotenv').config();
const pool = require(`./db/config.js`);
const Department = require(`./utils/department.js`);
const Employee = require(`./utils/employee.js`);
const Role = require(`./utils/role.js`);


pool.connect()
    .then(() => console.log('Connected to the database.'))
    .catch(err => console.error('Connection error:', err.stack));


async function init() {

    try {
        const department = new Department();
        const employee = new Employee();
        await employee.addEmployee(`Sasha`, `Polb`, 2, 3);

    } catch (error) {
        console.error('Error fetching departments:', error);
    }
}

init();