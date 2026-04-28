const vscode = require('vscode');

class DevInsightSidebarProvider {
    constructor(extensionUri) {
        this._extensionUri = extensionUri;
    }

    resolveWebviewView(webviewView) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    }

    updateSidebar(metrics, history, aiAdvice) {
        if (this._view) {
            this._view.webview.postMessage({
                type: 'update',
                metrics: metrics,
                history: history,
                aiAdvice: aiAdvice
            });
        }
    }

    _getHtmlForWebview(webview) {
        return `
            <!DOCTYPE html>
            <html lang="pt">
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: sans-serif; padding: 10px; color: var(--vscode-foreground); }
                    .card { background: var(--vscode-sideBar-background); border: 1px solid var(--vscode-widget-border); padding: 10px; margin-bottom: 10px; border-radius: 4px; }
                    .metric-title { font-size: 0.8em; opacity: 0.8; }
                    .metric-value { font-size: 1.5em; font-weight: bold; margin: 5px 0; }
                    .status-good { color: #4caf50; }
                    .status-warn { color: #f44336; }
                    .ai-card { 
                        background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); 
                        color: white; 
                        padding: 12px; 
                        border-radius: 4px; 
                        margin-top: 15px; 
                        font-style: italic; 
                        font-size: 0.9em; 
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
                    }
                </style>
            </head>
            <body>
                <h3>Resumo de Evolução</h3>
                <div id="metrics-container">
                    <p>Salve um ficheiro JS para ver a análise...</p>
                </div>

                <div id="ai-container"></div>

                <script>
                    const vscode = acquireVsCodeApi();
                    window.addEventListener('message', event => {
                        // Sincronização Total: metrics, history e aiAdvice
                        const { metrics, history, aiAdvice } = event.data;
                        
                        const container = document.getElementById('metrics-container');
                        const aiContainer = document.getElementById('ai-container');
                        
                        // Renderização das métricas
                        container.innerHTML = \`
                            <div class="card">
                                <div class="metric-title">Funções Totais</div>
                                <div class="metric-value">\${metrics.functionCount}</div>
                            </div>
                            <div class="card">
                                <div class="metric-title">Uso de 'var'</div>
                                <div class="metric-value \${metrics.varCount > 0 ? 'status-warn' : 'status-good'}">\${metrics.varCount}</div>
                            </div>
                            <div class="card">
                                <div class="metric-title">Linhas de Código</div>
                                <div class="metric-value">\${metrics.lineCount}</div>
                            </div>
                        \`;

                        // Renderização da IA usando o nome correto: aiAdvice
                        if (aiAdvice && aiContainer) {
                            aiContainer.innerHTML = \`
                                <div class="ai-card">
                                    <strong>Dica do Mentor:</strong><br>
                                    "\${aiAdvice}"
                                </div>
                            \`;
                        }
                    });
                </script>
            </body>
            </html>`;
    }
}

module.exports = DevInsightSidebarProvider;