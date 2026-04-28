const fetch = require("node-fetch");
const path = require('path');

require('dotenv').config({
    path: path.join(__dirname, '.env')
});

const API_KEY = process.env.OPENROUTER_API_KEY;
async function generateEvolutionInsight(currentMetrics, history, patterns){

    const prompt = `
    Você é um mentor técnico de programação JavaScript moderno.

    REGRAS:
    - NÃO seja genérico
    - NÃO suavize problemas
    - NÃO diga "não há problemas" se houver más práticas
    - Use boas práticas modernas (ES6+)
    - Seja direto e crítico quando necessário
    - Máximo 2 frases

    DADOS ATUAIS:
    - Linhas: ${currentMetrics.lineCount}
    - Funções: ${currentMetrics.functionCount}
    - Uso de var: ${currentMetrics.varCount}

    COMPARAÇÃO:
    - var antes: ${patterns.previousVarCount}
    - var agora: ${patterns.lastVarCount}
    - tendência var: ${patterns.varTrend}

    - funções tendência: ${patterns.functionTrend}

    TAREFA:
    1. Identifique problemas REAIS
    2. Aponte melhoria concreta
    3. Se houver uso de "var", critique e sugira substituição

    IMPORTANTE:
    - "var" é considerado uma má prática moderna
    - Sempre que existir, deve ser apontado

    RESPOSTA:
    Direta, técnica e específica.
    `;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost",
                "X-Title": "DevInsight"
            },
            body: JSON.stringify({
                model: "openrouter/free",
                messages: [
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();

        console.log("Resposta completa da IA:", data);

        if (data.error) {
            console.error("Erro da API:", data.error.message);
            return "⚠️ Erro da IA: " + data.error.message;
        }

        if (!data.choices || !data.choices.length) {
            console.error("Resposta inválida:", data);
            return "⚠️ IA não retornou resposta válida.";
        }

        return data.choices[0].message.content;

    } catch (error) {
        console.error("Erro IA:", error);
        return "⚠️ IA indisponível.";
    }
}

module.exports = { generateEvolutionInsight };