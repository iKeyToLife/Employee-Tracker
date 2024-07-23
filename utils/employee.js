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
    async getAllEmployeesData() {
        const query = `SELECT 
    e.id,
    e.first_name,
    e.last_name,
    r.title AS title,
    d.name AS department,
    r.salary,
    NULLIF(CONCAT(m.first_name, ' ', m.last_name), ' ') AS manager
    FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON r.department = d.id
    LEFT JOIN employee m ON e.manager_id = m.id;`;

        const result = await pool.query(query);
        return result.rows;
    }

    async addEmployee(employee) {
        const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING first_name, last_name`;
        const values = [employee.firstName, employee.lastName, employee.roleId, employee.managerId];
        const result = await pool.query(query, values);
        console.log(`Added ${result.rows[0].first_name} ${result.rows[0].last_name} to the database`)
    }

    async updateEmployeeRoleById(id, roleId) {
        const query = `UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING first_name, last_name`;
        const values = [roleId, id];
        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            console.log(`Updated ${result.rows[0].first_name} ${result.rows[0].last_name} in the database`);
        } else {
            console.log(`Employee with id ${id} not found`);
        }
    }

    async updateEmployeeManagerById(id, managerId) {
        const query = `UPDATE employee SET manager_id = $1 WHERE id = $2 RETURNING first_name, last_name`;
        const values = [managerId, id];
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