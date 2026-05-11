function buildDeveloperProfile(
    metrics,
    history,
    behaviorProfile,
    evolutionProfile,
    ruleResults
) {

    /*
    =========================================
    MATURIDADE
    =========================================
    */

    let maturityLevel = "beginner";

    if (
        metrics.varCount === 0 &&
        metrics.constCount > 0 &&
        metrics.functionCount >= 2
    ) {
        maturityLevel = "intermediate";
    }

    if (
        metrics.varCount === 0 &&
        metrics.maxNestingLevel <= 2 &&
        metrics.largeFunctions.length === 0 &&
        metrics.tryCatchCount > 0
    ) {
        maturityLevel = "advanced";
    }

    /*
    =========================================
    ESTILO ARQUITETURAL
    =========================================
    */

    let architectureStyle = "balanced";

    if (
        metrics.functionCount <= 1 &&
        metrics.lineCount >= 20
    ) {
        architectureStyle = "monolithic";
    }

    if (
        metrics.functionCount >= 5
    ) {
        architectureStyle = "modular";
    }

    /*
    =========================================
    DISCIPLINA DE CÓDIGO
    =========================================
    */

    let codeDiscipline = "moderate";

    if (
        metrics.consoleLogCount >= 5 ||
        metrics.varCount >= 2
    ) {
        codeDiscipline = "low";
    }

    if (
        metrics.varCount === 0 &&
        metrics.consoleLogCount <= 1
    ) {
        codeDiscipline = "high";
    }

    /*
    =========================================
    MODERNIZAÇÃO
    =========================================
    */

    let modernizationLevel = "legacy";

    if (
        behaviorProfile.usesModernJavascript
    ) {
        modernizationLevel = "modern";
    }

    if (
        evolutionProfile.modernizationEvolution === "improving"
    ) {
        modernizationLevel = "evolving";
    }

    /*
    =========================================
    PONTOS FRACOS
    =========================================
    */

    const mainWeaknesses = [];

    if (metrics.varCount > 0) {
        mainWeaknesses.push(
            "Uso recorrente de var"
        );
    }

    if (metrics.maxNestingLevel >= 3) {
        mainWeaknesses.push(
            "Complexidade elevada"
        );
    }

    if (metrics.largeFunctions.length > 0) {
        mainWeaknesses.push(
            "Funções muito grandes"
        );
    }

    if (
        behaviorProfile.inconsistentErrorHandling
    ) {
        mainWeaknesses.push(
            "Tratamento de erro inconsistente"
        );
    }

    if (
        behaviorProfile.modularizationTrend === "decreasing"
    ) {
        mainWeaknesses.push(
            "Modularização em regressão"
        );
    }

    /*
    =========================================
    PONTOS FORTES
    =========================================
    */

    const mainStrengths = [];

    if (
        metrics.varCount === 0
    ) {
        mainStrengths.push(
            "Boa utilização de let/const"
        );
    }

    if (
        metrics.tryCatchCount > 0
    ) {
        mainStrengths.push(
            "Uso de tratamento de erros"
        );
    }

    if (
        evolutionProfile.complexityEvolution === "improving"
    ) {
        mainStrengths.push(
            "Complexidade reduzindo ao longo do tempo"
        );
    }

    if (
        evolutionProfile.modernizationEvolution === "improving"
    ) {
        mainStrengths.push(
            "Evolução no uso de JavaScript moderno"
        );
    }

    /*
    =========================================
    RISCO
    =========================================
    */

    let riskLevel = "low";

    if (
        metrics.maxNestingLevel >= 3 ||
        metrics.varCount >= 2
    ) {
        riskLevel = "medium";
    }

    if (
        metrics.largeFunctions.length >= 2
    ) {
        riskLevel = "high";
    }

    return {

        maturityLevel,

        architectureStyle,

        codeDiscipline,

        modernizationLevel,

        mainWeaknesses,

        mainStrengths,

        riskLevel
    };
}

module.exports = {
    buildDeveloperProfile
};