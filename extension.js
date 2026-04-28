const vscode = require('vscode');
const dbHandler = require('./database');
const SidebarProvider = require('./sidebarProvider');
const aiService = require('./aiService');
const analysisService = require('./analysisService');

function activate(context) {
    dbHandler.initDatabase(context);

    // INICIALIZAÇÃO DA SIDEBAR
    const sidebarProvider = new SidebarProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider("devinsight.sidebarView", sidebarProvider)
    );

    const outputChannel = vscode.window.createOutputChannel("DevInsight");
    
    vscode.window.showInformationMessage('DevInsight: Monitoramento e Dashboard Ativos!');

    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    statusBarItem.text = "$(graph) DevInsight Ativo";
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    let onSave = vscode.workspace.onDidSaveTextDocument(async (document) => {
        if (document.languageId === "javascript") {

            const text = document.getText();
            const fileName = document.fileName;

            // --- MÉTRICAS ---
            const metrics = {
                timestamp: new Date(),
                fileName: fileName,
                lineCount: document.lineCount,
                functionCount: (text.match(/\bfunction\b|=>/g) || []).length,
                varCount: (text.match(/\bvar\b/g) || []).length
            };

            // --- HISTÓRICO + IA ---
            const history = await dbHandler.getHistory(fileName, 5);
            const patterns = analysisService.analyzePatterns(history);
            const aiAdvice = await aiService.generateEvolutionInsight(metrics, history, patterns);

            // --- UI ---
            sidebarProvider.updateSidebar(metrics, history, aiAdvice);

            // --- BANCO ---
            try {
                await dbHandler.saveEvolution(metrics);
                outputChannel.appendLine(`[${metrics.timestamp.toLocaleTimeString()}] Sincronizado com o Dashboard.`);
            } catch (err) {
                outputChannel.appendLine(`[ERRO] ${err}`);
            }
        }
    });

    context.subscriptions.push(onSave);
}

function deactivate() {}

module.exports = { activate, deactivate };