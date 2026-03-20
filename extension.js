const vscode = require('vscode');

function activate(context) {

    console.log('DevInsight está ativo!');

    vscode.workspace.onDidSaveTextDocument((document) => {
        console.log("Arquivo salvo:", document.fileName);
        console.log("Conteúdo:", document.getText());
        console.log("Data:", new Date().toLocaleString());
    });
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
};