import { Pool } from "pg";

export const pool = new Pool({
    user: "rithikamandiv",
    host: "localhost",
    database: "budgetwise",
    password: "",
    port: 5432
});

