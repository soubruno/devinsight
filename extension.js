const vscode = require('vscode');
const dbHandler = require('./database');
const SidebarProvider = require('./sidebarProvider');
const aiService = require('./aiService');
const analysisService = require('./analysisService');
const codeAnalysisService = require('./codeAnalysisService');
const behaviorAnalysisService = require('./behaviorAnalysisService');
const ruleEngineService = require('./ruleEngineService');
const evolutionAnalysisService = require('./evolutionAnalysisService');
const developerProfileService = require('./developerProfileService');

let debounceTimer;

function activate(context) {
    dbHandler.initDatabase(context);

    // INICIALIZAÇÃO DA SIDEBAR
    const sidebarProvider = new SidebarProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider("devinsight.sidebarView", sidebarProvider)
    );

    const outputChannel = vscode.window.createOutputChannel("DevInsight");
    
    // ESCUTAR MENSAGENS DA SIDEBAR (Pedido de Diff)
    sidebarProvider.onDidReceiveMessage(async (data) => {
        if (data.type === 'showDiff') {
            const history = await dbHandler.getHistory(data.fileName, 2);
            if (history.length < 2) {
                vscode.window.showInformationMessage("Histórico insuficiente para comparação.");
                return;
            }
            // Envia os dados comparativos de volta para a Sidebar
            sidebarProvider.postDiff(history[1], history[0]);
        }
    });

    let onSave = vscode.workspace.onDidSaveTextDocument(async (document) => {
        if (document.languageId === "javascript") {
            
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }

            // Define um atraso de 1,5 segundos (1500ms) antes de chamar a IA
            debounceTimer = setTimeout(async () => {
                const text = document.getText();
                const fileName = document.fileName;

                const analysisMetrics = codeAnalysisService.analyzeCode(text);

                const metrics = {
                    timestamp: new Date(),
                    fileName: fileName,
                    lineCount: document.lineCount,
                    sourceCode: text,

                    ...analysisMetrics
                };

                const history = await dbHandler.getHistory(fileName, 10);

                const patterns =
                    analysisService.analyzePatterns(history);

                const behaviorProfile =
                    behaviorAnalysisService.analyzeDeveloperBehavior(history);
                
                const evolutionProfile =
                    evolutionAnalysisService.analyzeEvolution(history);
                const ruleResults =
                    ruleEngineService.evaluateRules(
                        metrics,
                        history,
                        behaviorProfile
                    );

                const developerProfile =
                    developerProfileService.buildDeveloperProfile(
                        metrics,
                        history,
                        behaviorProfile,
                        evolutionProfile,
                        ruleResults
                    );

                const aiAdvice =
                    await aiService.generateEvolutionInsight(
                        metrics,
                        history,
                        patterns,
                        behaviorProfile,
                        evolutionProfile,
                        ruleResults,
                        developerProfile
                    );

                sidebarProvider.updateSidebar(metrics, history, aiAdvice);

                try {
                    await dbHandler.saveEvolution(metrics);
                    outputChannel.appendLine(`[${metrics.timestamp.toLocaleTimeString()}] Sincronizado com o Dashboard.`);
                } catch (err) {
                    outputChannel.appendLine(`[ERRO] ${err}`);
                }
            }, 1500); 
        }
    });

    context.subscriptions.push(onSave);
}

function deactivate() {}

module.exports = { activate, deactivate };