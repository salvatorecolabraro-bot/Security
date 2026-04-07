const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize database
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS sites (
      site_code TEXT PRIMARY KEY,
      region TEXT,
      province TEXT,
      city TEXT,
      status TEXT,
      latitude REAL,
      longitude REAL,
      data_immobili TEXT,
      data_class_point TEXT,
      merged_data TEXT
    )
  `, (err) => {
    if (err) {
      console.error("Errore creazione tabella:", err.message);
    } else {
      console.log("Tabella 'sites' pronta.");
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS arls (
      codice_sito TEXT PRIMARY KEY,
      latitude REAL,
      longitude REAL,
      fol TEXT,
      ff TEXT,
      provincia TEXT,
      comune TEXT,
      indirizzo TEXT,
      data TEXT
    )
  `, (err) => {
    if (err) {
      console.error("Errore creazione tabella arls:", err.message);
    } else {
      console.log("Tabella 'arls' pronta.");
      // Check if old table needs to be altered to add the new columns
      db.all("PRAGMA table_info(arls)", (err, rows) => {
        if (!err && rows) {
          const columns = rows.map(r => r.name);
          if (!columns.includes('fol')) {
            console.log("Aggiornamento schema tabella arls...");
            db.run("ALTER TABLE arls ADD COLUMN fol TEXT");
            db.run("ALTER TABLE arls ADD COLUMN ff TEXT");
            db.run("ALTER TABLE arls ADD COLUMN provincia TEXT");
            db.run("ALTER TABLE arls ADD COLUMN comune TEXT");
            db.run("ALTER TABLE arls ADD COLUMN indirizzo TEXT");
          }
        }
      });
    }
  });
});

module.exports = db;
