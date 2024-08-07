import "dotenv/config";

export default {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.PW,
    database: process.env.DB,
    charset: "utf8",
    timezone: 'Z'
  },
};
