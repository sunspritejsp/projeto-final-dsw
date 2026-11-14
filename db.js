const Database = require("better-sqlite3");

const db = new Database('cinemais.db');

db.exec(`CREATE TABLE IF NOT EXISTS members(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    registration_date TEXT NOT NULL DEFAULT(datetime('now', 'localtime')),
    email TEXT NOT NULL,
    birth_date TEXT NOT NULL,
    plan TEXT NOT NULL CHECK(plan IN('Pequena', 'Média','Grande')),
    student INTEGER NOT NULL CHECK(student IN (0,1)),
    zip_code TEXT NOT NULL,
    street TEXT NOT NULL,
    house_number INTEGER,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    address_details TEXT
    )`);

module.exports = db;