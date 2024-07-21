const pool = require(`../db/config`);

class Role {
    async getRoles() {
        const result = await pool.query('SELECT * FROM role');
        return result.rows;
    }
}

module.exports = Role;