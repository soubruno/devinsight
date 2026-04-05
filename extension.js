const vscode = require('vscode');
const dbHandler = require('./database');

function activate(context) {
    dbHandler.initDatabase(context);

    const outputChannel = vscode.window.createOutputChannel("DevInsight");
    outputChannel.show(true);
    vscode.window.showInformationMessage('DevInsight: Monitoramento com Banco de Dados Ativo!');

    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );

    const diagnostics = vscode.languages.createDiagnosticCollection("devinsight");

    context.subscriptions.push(diagnostics);

    statusBarItem.text = "DevInsight ativo";
    statusBarItem.show();

    context.subscriptions.push(statusBarItem);

    let onSave = vscode.workspace.onDidSaveTextDocument(async (document) => {

        if (document.languageId === "javascript") {
            const text = document.getText();

            // DIAGNÓSTICOS
            const diagnosticList = [];
            const lines = text.split("\n");

            // Detectar código duplicado (blocos de 3 linhas)
            const blockSize = 3;
            const blockMap = {};

            for (let i = 0; i <= lines.length - blockSize; i++) {

                const block = lines
                    .slice(i, i + blockSize)
                    .map(l => l.trim())
                    .join("");

                if (!block || block.length < 10) continue;

                if (blockMap[block]) {
                    blockMap[block].push(i);
                } else {
                    blockMap[block] = [i];
                }
            }

            // Criar diagnósticos
            Object.keys(blockMap).forEach(block => {
                const occurrences = blockMap[block];

                if (occurrences.length > 1) {
                    occurrences.forEach(lineIndex => {

                        const range = new vscode.Range(
                            new vscode.Position(lineIndex, 0),
                            new vscode.Position(lineIndex + blockSize, 0)
                        );

                        diagnosticList.push(
                            new vscode.Diagnostic(
                                range,
                                "DevInsight: Código duplicado detectado. Considere reutilizar essa lógica.",
                                vscode.DiagnosticSeverity.Warning
                            )
                        );
                    });
                }
            });

            // Detectar let que pode ser const
            lines.forEach((line, index) => {

                const letMatch = line.match(/\blet\s+(\w+)/);

                if (letMatch) {
                    const varName = letMatch[1];

                    // Verifica se a variável é reatribuída depois
                    const isReassigned = lines.some((l, i) => {
                        if (i <= index) return false;

                        return new RegExp(`\\b${varName}\\s*(=|\\+\\+|--|\\+=|-=|\\*=|/=)`).test(l)
                        || new RegExp(`(\\+\\+|--)\\s*${varName}`).test(l);
                    });

                    if (!isReassigned) {
                        const range = new vscode.Range(
                            new vscode.Position(index, 0),
                            new vscode.Position(index, line.length)
                        );

                        diagnosticList.push(
                            new vscode.Diagnostic(
                                range,
                                `DevInsight: '${varName}' nunca é reatribuída. Use const.`,
                                vscode.DiagnosticSeverity.Information
                            )
                        );
                    }
                }
            });

            lines.forEach((line, index) => {

                if (line.includes("console.log")) {
                    const range = new vscode.Range(
                        new vscode.Position(index, 0),
                        new vscode.Position(index, line.length)
                    );

                    diagnosticList.push(
                        new vscode.Diagnostic(
                            range,
                            "DevInsight: Evite deixar console.log no código final.",
                            vscode.DiagnosticSeverity.Warning
                        )
                    );
                }

                if (line.includes("var ")) {
                    const range = new vscode.Range(
                        new vscode.Position(index, 0),
                        new vscode.Position(index, line.length)
                    );

                    diagnosticList.push(
                        new vscode.Diagnostic(
                            range,
                            "DevInsight: Use let ou const em vez de var.",
                            vscode.DiagnosticSeverity.Information
                        )
                    );
                }
            });

            diagnostics.set(document.uri, diagnosticList);

            // MÉTRICAS
            const metrics = {
                timestamp: new Date(),
                fileName: document.fileName,
                lineCount: document.lineCount,
                functionCount: (text.match(/\bfunction\b|=>/g) || []).length,
                varCount: (text.match(/\bvar\b/g) || []).length
            };

            // BANCO
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
    context.subscriptions.push(onSave);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};