const pool = require(`../db/config`);

class Role {
    constructor(title, salary, department) {
        if (arguments.length === 0) {
        } else {
            this.title = title;
            this.salary = salary;
            this.department = department;
        }
    }

    async getAllRoles() {
        const result = await pool.query('SELECT * FROM role');
        return result.rows;
    }

    async addRole(role) {
        const query = `INSERT INTO role (title, salary, department) VALUES ($1, $2, $3) RETURNING title`;
        const values = [role.title, role.salary, role.department];
        const result = await pool.query(query, values);
        console.log(`Added Role ${result.rows[0].title} to the database`)
    }

    async deleteRoleById(id) {
        const query = `DELETE FROM role WHERE id = $1 RETURNING title`
        const values = [id];
        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            console.log(`Deleted ${result.rows[0].title} in the database`)
        } else {
            console.log(`Role with id ${id} not found`);
        }
    }
}

module.exports = Role;