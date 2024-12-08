import { Database, MySQLConnector } from "./deps.ts";
import User from "./models/User.ts";

const connector = new MySQLConnector({
  database: "mydb",
  host: "127.0.0.1",
  username: "myuser",
  password: "mypassword",
  port: 3306,
});

const db = new Database(connector);
db.link([User]);

// Uncomment the following line to sync the database (create tables)
await db.sync({ drop: false });

export default db;
