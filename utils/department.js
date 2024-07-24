const pool = require(`../db/config`);

class Department {

    // Retrieve all departments from the database
    async getAllDepartments() {
        const result = await pool.query(`SELECT * FROM department`);
        return result.rows;
    }

    // Add a new department to the database and log the added department's name
    async addDepartment(name) {
        const query = `INSERT INTO department (name) VALUES ($1) RETURNING name`;
        const values = [name];
        const result = await pool.query(query, values);
        console.log(`Added ${result.rows[0].name} to the database`)
    }

    // Delete a department by its ID and log the deleted department's name
    async deleteDepartmentById(id) {
        const query = `DELETE FROM department WHERE id = $1 RETURNING name`
        const values = [id];
        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            console.log(`Deleted ${result.rows[0].name} in the database`)
        } else {
            console.log(`Department with id ${id} not found`);
        }
    }

    // Retrieve employees by their department ID
    async getEmployeesByDepartmentId(id) {
        const result = await pool.query(`SELECT d.name AS department, CONCAT(e.first_name, ' ', e.last_name) AS employee
        FROM department d
        JOIN role r ON d.id = r.department
        JOIN employee e ON r.id = e.role_id
        WHERE d.id = $1`, [id]);
        return result.rows;
    }

    // Retrieve the total budget of a department by its ID
    async getBudgetDepartmentById(id) {
        const result = await pool.query(`SELECT d.name AS department, SUM(r.salary) AS total_budget
            FROM department d
            JOIN role r ON d.id = r.department
            JOIN employee e ON r.id = e.role_id
            WHERE d.id = $1
            GROUP BY d.name`, [id]);
        return result.rows;
    }
}

module.exports = Department;