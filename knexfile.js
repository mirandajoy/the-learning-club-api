import "dotenv/config";

export default {
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: process.env.PW,
    database: process.env.DB,
    charset: "utf8",
    timezone: 'Z'
  },
};
