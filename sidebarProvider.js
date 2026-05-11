const vscode = require('vscode');

class DevInsightSidebarProvider {
    constructor(extensionUri) {
        this._extensionUri = extensionUri;
        this._onMessageCallbacks = [];
    }

    resolveWebviewView(webviewView) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(data => {
            this._onMessageCallbacks.forEach(cb => cb(data));
        });
    }

    onDidReceiveMessage(callback) {
        this._onMessageCallbacks.push(callback);
    }

    updateSidebar(metrics, history, aiAdvice) {
        if (this._view) {
            this._view.webview.postMessage({
                type: 'update',
                metrics,
                aiAdvice
            });
        }
    }

    postDiff(previous, current) {
        if (this._view) {
            this._view.webview.postMessage({
                type: 'displayHistoryDiff',
                previous,
                current
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
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                        padding: 0; 
                        margin: 0;
                        background-color: #252526; 
                        color: white; 
                    }
                    
                    header {
                        background-color: #1e1e1e;
                        padding: 20px 10px;
                        text-align: center;
                    }

                    h3 { margin: 0; font-size: 1.1em; font-weight: bold; }

                    .metrics-row {
                        display: flex;
                        gap: 10px;
                        padding: 15px 10px;
                        background-color: #1e1e1e;
                    }

                    .card {
                        flex: 1;
                        background: #2d2d2d;
                        border: 2px solid #ffffff;
                        padding: 8px;
                        text-align: center;
                    }

                    .metric-title { font-size: 0.85em; font-weight: bold; margin-bottom: 5px; }
                    .metric-value { font-size: 1.4em; font-weight: bold; }

                    .mentor-section {
                        padding: 20px;
                        background-color: #333333;
                    }

                    .mentor-title { font-weight: bold; font-size: 1em; margin-bottom: 10px; display: block; }
                    .mentor-text { font-size: 0.95em; line-height: 1.5; opacity: 0.9; }

                    .actions {
                        display: flex;
                        justify-content: center;
                        padding: 20px;
                        background-color: #252526;
                    }

                    .btn-history {
                        background-color: #4b6fff;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        font-weight: bold;
                        font-size: 0.9em;
                        cursor: pointer;
                    }

                    .btn-history:hover { background-color: #3a5ccc; }

                    .diff-container { padding: 15px; display: none; background: #1e1e1e; }
                    pre {
                        background: #000;
                        color: #00ff00;
                        padding: 10px;
                        font-size: 0.8em;
                        overflow-x: auto;
                        white-space: pre-wrap;
                        border: 1px solid #444;
                    }
                </style>
            </head>
            <body>
                <header>
                    <h3>Resumo da Evolução</h3>
                </header>

                <div class="metrics-row" id="metrics-row">
                    <div class="card">
                        <div class="metric-title">Funções:</div>
                        <div class="metric-value" id="func-val">-</div>
                    </div>
                    <div class="card">
                        <div class="metric-title">Var:</div>
                        <div class="metric-value" id="var-val">-</div>
                    </div>
                </div>

                <div class="mentor-section">
                    <span class="mentor-title">Mentor:</span>
                    <div class="mentor-text" id="ai-text">Salve um arquivo para iniciar a análise...</div>
                </div>

                <div class="actions">
                    <button class="btn-history" id="btn-diff">O que mudou:</button>
                </div>

                <div id="diff-section" class="diff-container">
                    <div id="diff-content"></div>
                </div>

                <script>
                    const vscode = acquireVsCodeApi();
                    let currentFile = "";

                    function escapeHtml(unsafe) {
                        return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    }

                    window.addEventListener('message', event => {
                        const data = event.data;

                        if (data.type === 'update') {
                            const { metrics, aiAdvice } = data;
                            currentFile = metrics.fileName;
                            
                            document.getElementById('func-val').innerText = metrics.functionCount;
                            document.getElementById('var-val').innerText = metrics.varCount;
                            document.getElementById('ai-text').innerText = aiAdvice || "Analisando...";
                        }

                        if (data.type === 'displayHistoryDiff') {
                            const section = document.getElementById('diff-section');
                            section.style.display = 'block';
                            document.getElementById('diff-content').innerHTML = \`
                                <p style="font-size:0.8em; color:#aaa;">Versão Anterior:</p>
                                <pre>\${escapeHtml(data.previous.sourceCode)}</pre>
                                <p style="font-size:0.8em; color:#aaa; margin-top:10px;">Versão Atual:</p>
                                <pre>\${escapeHtml(data.current.sourceCode)}</pre>
                            \`;
                        }
                    });

                    document.getElementById('btn-diff').addEventListener('click', () => {
                        if(currentFile) vscode.postMessage({ type: 'showDiff', fileName: currentFile });
                    });
                </script>
            </body>
            </html>`;
    }
}

module.exports = DevInsightSidebarProvider;