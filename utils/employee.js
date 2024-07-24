const pool = require(`../db/config`);

class Employee {

    constructor(firstName, lastName, roleId, managerId = null) {
        // If no arguments are passed, do nothing (could be used for methods that don't require these properties)
        if (arguments.length === 0) {
        } else { // Initialize properties if arguments are provided
            this.firstName = firstName;
            this.lastName = lastName;
            this.roleId = roleId;
            this.managerId = managerId;
        }
    }

    // Query to get all employee data with their role, department, and manager
    async getAllEmployeesData() {

        // Query to retrieve all employee data, including role, department, and manager
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

        // Execute the query and return the rows
        const result = await pool.query(query);
        return result.rows;
    }

    // Insert a new employee into the database and log the result
    async addEmployee(employee) {
        const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING first_name, last_name`;
        const values = [employee.firstName, employee.lastName, employee.roleId, employee.managerId];
        const result = await pool.query(query, values);
        console.log(`Added ${result.rows[0].first_name} ${result.rows[0].last_name} to the database`)
    }

    // Update the role of an employee by their ID and log the updated employee's name
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

    // Update the manager of an employee by their ID and log the updated employee's name
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

    // Delete an employee by their ID and log the deleted employee's name
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

    // Retrieve employees by their manager's ID
    async getEmployeesByManagerId(id) {
        const result = await pool.query(`SELECT 
            CONCAT(e.first_name, ' ', e.last_name) AS employee, 
            CONCAT(m.first_name, ' ', m.last_name) AS manager 
            FROM employee e JOIN employee m ON e.manager_id = m.id 
            WHERE m.id = $1;`, [id]);
        return result.rows;
    }
}

module.exports = Employee;