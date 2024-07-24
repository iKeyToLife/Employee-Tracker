const pool = require(`../db/config`);

class Role {
    constructor(title, salary, department) {
        // If no arguments are provided, do nothing
        if (arguments.length === 0) {

            // Assigns the provided arguments to the instance properties
        } else {
            this.title = title;
            this.salary = salary;
            this.department = department;
        }
    }

    // Executes a query to get all roles from the database
    async getAllRoles() {
        const result = await pool.query('SELECT * FROM role');
        return result.rows;
    }

    async addRole(role) {
        // Query to insert a new role into the database
        const query = `INSERT INTO role (title, salary, department) VALUES ($1, $2, $3) RETURNING title`;

        // Values to be inserted into the database
        const values = [role.title, role.salary, role.department];

        // Executes the query with the provided values
        const result = await pool.query(query, values);

        // Logs a message indicating the role was added
        console.log(`Added Role ${result.rows[0].title} to the database`)
    }

    async deleteRoleById(id) {

        // Query to delete a role by its id
        const query = `DELETE FROM role WHERE id = $1 RETURNING title`

        // Value of the id to be deleted
        const values = [id];

        // Executes the query with the provided id
        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            // Logs a message indicating the role was deleted
            console.log(`Deleted ${result.rows[0].title} in the database`)
        } else {
            // Logs a message indicating the role with the specified id was not found
            console.log(`Role with id ${id} not found`);
        }
    }
}

module.exports = Role;