const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.all('SELECT codice_sito, data FROM arls WHERE fol IS NULL OR ff IS NULL OR provincia IS NULL', [], (err, rows) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Trovati ${rows.length} ARL da aggiornare...`);
  
  if (rows.length === 0) return;

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    const stmt = db.prepare('UPDATE arls SET fol = ?, ff = ?, provincia = ?, comune = ?, indirizzo = ? WHERE codice_sito = ?');
    
    let count = 0;
    rows.forEach(row => {
      try {
        const parsed = JSON.parse(row.data || '{}');
        const fol = parsed.FOL ? String(parsed.FOL).trim() : '';
        const ff = parsed.FF ? String(parsed.FF).trim() : '';
        const provincia = parsed.PROVINCIA ? String(parsed.PROVINCIA).trim() : '';
        const comune = parsed.COMUNE ? String(parsed.COMUNE).trim() : '';
        const indirizzo = parsed.INDIRIZZO ? String(parsed.INDIRIZZO).trim() : '';

        stmt.run(fol, ff, provincia, comune, indirizzo, row.codice_sito);
        count++;
      } catch(e) {
        console.error('Errore parsing per', row.codice_sito);
      }
    });

    stmt.finalize();
    db.run('COMMIT', () => {
      console.log(`Aggiornati ${count} ARL con successo!`);
      db.close();
    });
  });
});
