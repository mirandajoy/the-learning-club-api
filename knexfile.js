import "dotenv/config";

export default {
  client: "mysql2",
  connection: {
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQL_DATABASE,
    charset: "utf8",
    timezone: 'Z'
  },
};
