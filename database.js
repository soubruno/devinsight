const Datastore = require('@seald-io/nedb');
const path = require('path');
const vscode = require('vscode');
const fs = require('fs');

let db;

function initDatabase(extensionContext) {
    const storagePath = extensionContext.globalStorageUri.fsPath;

    if (!fs.existsSync(storagePath)) {
        fs.mkdirSync(storagePath, { recursive: true });
    }
    
    const dbPath = path.join(storagePath, 'devinsight_history.db');

    // Inicializa o banco de dados (NeDB)
    db = new Datastore({ filename: dbPath, autoload: true });
    
    console.log(`[DevInsight] Banco de dados inicializado em: ${dbPath}`);
    return db;
}

// Função para salvar um novo registro de evolução
function saveEvolution(data) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject("Banco de dados não inicializado!");
            return;
        }
        db.insert(data, (err, newDoc) => {
            if (err) reject(err);
            else resolve(newDoc);
        });
    });
}

function getHistory(fileName, limit = 5) {
    return new Promise((resolve, reject) => {
        db.find({ fileName })
          .sort({ timestamp: -1 })
          .limit(limit)
          .exec((err, docs) => {
              if (err) reject(err);
              else resolve(docs);
          });
    });
}

module.exports = { initDatabase, saveEvolution, getHistory };