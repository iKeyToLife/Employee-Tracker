const pool = require(`../db/config`);

class Department {
    async getAllDepartments() {
        const result = await pool.query(`SELECT * FROM department`);
        return result.rows;
    }

    async addDepartment(name) {
        const query = `INSERT INTO department (name) VALUES ($1) RETURNING name`;
        const values = [name];
        const result = await pool.query(query, values);
        console.log(`Added ${result.rows[0].name} to the database`)

    }

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
}

module.exports = Department;