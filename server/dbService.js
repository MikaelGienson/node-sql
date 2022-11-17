const mysql = require("mysql");
const dotenv = require("dotenv");
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log("db ", connection.state);
});

class DbService {
  static getDBServiceInstance() {
    return instance ? instance : new DbService();
  }

  async getAllData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM names;";

        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async insertNewName(name) {
    try {
      const date_added = new Date();
      const insertId = await new Promise((resolve, reject) => {
        const query = "INSERT INTO names (name, date_added) VALUES (?, ?) ";

        connection.query(query, [name, date_added], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.insertId);
        });
      });

      return {
        id: insertId,
        dateadded: date_added,
        name: name,
      };
    } catch (err) {
      console.log(err);
    }
  }

  async updateRowById(id, name) {
    console.log(id);
    id = parseInt(id, 10);
    console.log(name);

    try {
      const response = await new Promise((resolve, reject) => {
        const query = "UPDATE names SET name = ? WHERE id = ? ";

        connection.query(query, [name, id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });

      return response === 1 ? true : false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async deleteRowById(id) {
    id = parseInt(id, 10);
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM names WHERE id = ? ";

        connection.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });
      return response === 1 ? true : false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async searchByName(name) {
    console.log(name)
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM names WHERE name = ? ";
console.log(query)
        connection.query(query, [name], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
          console.log(results)
        });
      });
      console.log(response)
      return response
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

module.exports = DbService;
