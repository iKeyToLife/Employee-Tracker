const pool = require(`../db/config`);

class Employee {
    async getEmployees() {
        const result = await pool.query('SELECT * FROM employee');
        return result.rows;
    }

    async addEmployee(firstName, lastName, roleId, managerId) {
        const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING first_name, last_name`;
        const values = [firstName, lastName, roleId, managerId];
        const result = await pool.query(query, values);
        console.log(`Added ${result.rows[0].first_name} ${result.rows[0].last_name} to the database`)

    }
}

module.exports = Employee;