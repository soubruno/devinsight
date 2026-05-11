const fetch = require("node-fetch");
const path = require('path');

require('dotenv').config({
    path: path.join(__dirname, '.env')
});

const API_KEY = process.env.OPENROUTER_API_KEY;
async function generateEvolutionInsight(
    currentMetrics,
    history,
    patterns,
    behaviorProfile,
    evolutionProfile,
    ruleResults,
    developerProfile
){
console.log(ruleResults);
    const prompt = `
    Você é um mentor técnico sênior especializado em JavaScript moderno.

    Você analisa evolução REAL de código.

    Seu trabalho:
    - identificar más práticas
    - detectar complexidade desnecessária
    - apontar problemas estruturais
    - sugerir melhorias concretas
    - analisar evolução do programador ao longo do tempo

    REGRAS IMPORTANTES:
    - NÃO seja genérico
    - NÃO elogie sem motivo
    - NÃO invente problemas
    - Seja técnico e específico
    - Analise os dados reais
    - Responda no máximo em 3 frases
    - Se houver problemas estruturais, priorize eles
    - Sempre considere boas práticas ES6+

    MÉTRICAS ATUAIS:

    Linhas:
    ${currentMetrics.lineCount}

    Funções:
    ${currentMetrics.functionCount}

    Arrow Functions:
    ${currentMetrics.arrowFunctionCount}

    Funções Async:
    ${currentMetrics.asyncFunctionCount}

    Uso de var:
    ${currentMetrics.varCount}

    Uso de let:
    ${currentMetrics.letCount}

    Uso de const:
    ${currentMetrics.constCount}

    console.log:
    ${currentMetrics.consoleLogCount}

    try/catch:
    ${currentMetrics.tryCatchCount}

    ifs:
    ${currentMetrics.ifCount}

    loops:
    ${currentMetrics.loopCount}

    Nível máximo de nesting:
    ${currentMetrics.maxNestingLevel}

    Tamanho médio das funções:
    ${currentMetrics.averageFunctionSize}

    Funções grandes:
    ${JSON.stringify(currentMetrics.largeFunctions)}

    PERFIL COMPORTAMENTAL DO PROGRAMADOR:

    Uso frequente de var:
    ${behaviorProfile.frequentlyUsesVar}

    Melhorando uso de var:
    ${behaviorProfile.improvingVarUsage}

    Cria funções grandes frequentemente:
    ${behaviorProfile.frequentlyCreatesLargeFunctions}

    Uso excessivo de console.log:
    ${behaviorProfile.excessiveConsoleLogs}

    Complexidade aumentando:
    ${behaviorProfile.increasingComplexity}

    Usa JavaScript moderno:
    ${behaviorProfile.usesModernJavascript}

    Tratamento de erro inconsistente:
    ${behaviorProfile.inconsistentErrorHandling}

    Tendência de modularização:
    ${behaviorProfile.modularizationTrend}

    Tendência de complexidade:
    ${behaviorProfile.complexityTrend}

    EVOLUÇÃO REAL DO PROGRAMADOR:

    Uso de var:
    ${evolutionProfile.varEvolution}

    Complexidade:
    ${evolutionProfile.complexityEvolution}

    Modularização:
    ${evolutionProfile.modularizationEvolution}

    Tratamento de erros:
    ${evolutionProfile.errorHandlingEvolution}

    Uso de JavaScript moderno:
    ${evolutionProfile.modernizationEvolution}

    REGRAS DETECTADAS PELO SISTEMA:

    Issues:
    ${ruleResults.issues?.length
        ? ruleResults.issues.join("\n")
        : "Nenhum issue detectado."}

    Warnings:
    ${ruleResults.warnings?.length
        ? ruleResults.warnings.join("\n")
        : "Nenhum warning detectado."}

    Positives:
    ${ruleResults.positives?.length
        ? ruleResults.positives.join("\n")
        : "Nenhum ponto positivo detectado."}

    Resumo:
    ${ruleResults.summary}

    ANÁLISE NECESSÁRIA:

    Analise o comportamento do programador ao longo do histórico.

    Descubra:
    - hábitos recorrentes
    - regressões
    - melhorias reais
    - padrões de arquitetura
    - evolução de qualidade
    - sinais de complexidade crescente
    - dependência excessiva de logs
    - modularização insuficiente
    - uso consistente (ou inconsistente) de boas práticas modernas

    IMPORTANTE:
    Você deve analisar:
    1. o código atual
    2. os padrões históricos
    3. o perfil comportamental do desenvolvedor

    Seu foco principal NÃO é apenas o código atual.
    Seu foco principal é a evolução do programador.

    IMPORTANTE SOBRE A RESPOSTA:

    - Fale sobre comportamento recorrente quando identificar padrões
    - Detecte evolução real
    - Detecte regressões reais
    - Não fale apenas do snapshot atual
    - Se existir repetição de más práticas, mencione isso
    - Se existir melhora consistente, mencione isso
    - A resposta deve parecer uma análise evolutiva de um programador real

    PERFIL CONSOLIDADO DO DESENVOLVEDOR:

    Nível de maturidade:
    ${developerProfile.maturityLevel}

    Estilo arquitetural:
    ${developerProfile.architectureStyle}

    Disciplina de código:
    ${developerProfile.codeDiscipline}

    Nível de modernização:
    ${developerProfile.modernizationLevel}

    Pontos fracos:
    ${developerProfile.mainWeaknesses.join(", ")}

    Pontos fortes:
    ${developerProfile.mainStrengths.join(", ")}

    Nível de risco:
    ${developerProfile.riskLevel}

    Responda como um mentor técnico experiente.
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
                model: "anthropic/claude-3-haiku",
                messages: [
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();

        console.log("Resposta completa da IA:", data);

        if (data.error) {

            console.error("ERRO COMPLETO OPENROUTER:");
            console.error(JSON.stringify(data, null, 2));

            return `⚠️ ${data.error.message}`;
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