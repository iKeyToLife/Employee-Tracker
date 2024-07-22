const pool = require(`../db/config`);

class Employee {
    constructor(firstName, lastName, roleId, managerId = null) {
        if (arguments.length === 0) {
        } else {
            this.firstName = firstName;
            this.lastName = lastName;
            this.roleId = roleId;
            this.managerId = managerId;
        }
    }
    async getAllEmployees() {
        const result = await pool.query('SELECT * FROM employee');
        return result.rows;
    }

    async addEmployee(employee) {
        const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING first_name, last_name`;
        const values = [employee.firstName, employee.lastName, employee.roleId, employee.managerId];
        const result = await pool.query(query, values);
        console.log(`Added ${result.rows[0].first_name} ${result.rows[0].last_name} to the database`)
    }

    async updateEmployeeById(id, employee) {
        const query = `UPDATE employee SET first_name = $1, last_name = $2, role_id = $3, manager_id = $4 WHERE id = $5 RETURNING first_name, last_name`;
        const values = [employee.firstName, employee.lastName, employee.roleId, employee.managerId, id];
        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            console.log(`Updated ${result.rows[0].first_name} ${result.rows[0].last_name} in the database`);
        } else {
            console.log(`Employee with id ${id} not found`);
        }
    }

    async deleteEmployeeById(id) {
        const query = `DELETE FROM employee WHERE id = $1 RETURNING first_name, last_name`
        const values = [id];
        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            console.log(`Deleted ${result.rows[0].first_name} ${result.rows[0].last_name} in the database`)
        } else {
            console.log(`Employee with id ${id} not found`);
        }
    }
}

module.exports = Employee;