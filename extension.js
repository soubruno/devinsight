const vscode = require('vscode');
const dbHandler = require('./database');

function activate(context) {
    dbHandler.initDatabase(context);

    const outputChannel = vscode.window.createOutputChannel("DevInsight");
    outputChannel.show(true);
    vscode.window.showInformationMessage('DevInsight: Monitoramento com Banco de Dados Ativo!');

    let onSave = vscode.workspace.onDidSaveTextDocument(async (document) => {
        if (document.languageId === "javascript") {
            const text = document.getText();
            
            // Metadados extraídos
            const metrics = {
                timestamp: new Date(),
                fileName: document.fileName,
                lineCount: document.lineCount,
                functionCount: (text.match(/\bfunction\b|=>/g) || []).length,
                varCount: (text.match(/\bvar\b/g) || []).length
            };

            // Salva no banco de dados
            try {
                await dbHandler.saveEvolution(metrics);
                outputChannel.appendLine(`[${metrics.timestamp.toLocaleTimeString()}] ✅ Dados persistidos no banco local.`);
            } catch (err) {
                outputChannel.appendLine(`[ERRO] Falha ao salvar no banco: ${err}`);
            }

            outputChannel.appendLine(`- Arquivo: ${metrics.fileName}`);
            outputChannel.appendLine(`- Funções: ${metrics.functionCount} | Vars: ${metrics.varCount}`);
            outputChannel.appendLine(`--------------------------------------------`);
        }
    });
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
};