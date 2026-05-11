// Transformar historico em comportamento

function analyzeDeveloperBehavior(history) {

    if (!history || history.length < 2) {

        return {
            frequentlyUsesVar: false,
            improvingVarUsage: false,

            frequentlyCreatesLargeFunctions: false,

            excessiveConsoleLogs: false,

            increasingComplexity: false,

            usesModernJavascript: false,

            inconsistentErrorHandling: false,

            modularizationTrend: "stable",

            complexityTrend: "stable"
        };
    }

    const totalSnapshots = history.length;

    // =========================
    // ACUMULADORES
    // =========================

    let totalVar = 0;
    let totalConsoleLogs = 0;
    let totalLargeFunctions = 0;
    let totalTryCatch = 0;
    let totalFunctions = 0;
    let totalConst = 0;
    let totalLet = 0;
    let totalNesting = 0;

    // =========================
    // ANALISAR HISTÓRICO
    // =========================

    history.forEach(snapshot => {

        totalVar += snapshot.varCount || 0;

        totalConsoleLogs += snapshot.consoleLogCount || 0;

        totalTryCatch += snapshot.tryCatchCount || 0;

        totalFunctions += snapshot.functionCount || 0;

        totalConst += snapshot.constCount || 0;

        totalLet += snapshot.letCount || 0;

        totalNesting += snapshot.maxNestingLevel || 0;

        if (snapshot.largeFunctions) {
            totalLargeFunctions += snapshot.largeFunctions.length;
        }
    });

    // =========================
    // TENDÊNCIAS
    // =========================

    const latest = history[0];
    const oldest = history[history.length - 1];

    const varTrend =
        (latest.varCount || 0) -
        (oldest.varCount || 0);

    const nestingTrend =
        (latest.maxNestingLevel || 0) -
        (oldest.maxNestingLevel || 0);

    const functionTrend =
        (latest.functionCount || 0) -
        (oldest.functionCount || 0);

    // =========================
    // PERFIL COMPORTAMENTAL
    // =========================

    const frequentlyUsesVar =
        totalVar >= totalSnapshots;

    const improvingVarUsage =
        varTrend < 0;

    const frequentlyCreatesLargeFunctions =
        totalLargeFunctions >= totalSnapshots;

    const excessiveConsoleLogs =
        totalConsoleLogs >= totalSnapshots * 2;

    const increasingComplexity =
        nestingTrend > 0;

    const usesModernJavascript =
        totalConst > totalVar;

    const inconsistentErrorHandling =
        totalFunctions > 0 &&
        totalTryCatch < (totalFunctions / 2);

    let modularizationTrend = "stable";

    if (functionTrend > 0) {
        modularizationTrend = "improving";
    }

    if (functionTrend < 0) {
        modularizationTrend = "decreasing";
    }

    let complexityTrend = "stable";

    if (nestingTrend > 0) {
        complexityTrend = "worsening";
    }

    if (nestingTrend < 0) {
        complexityTrend = "improving";
    }

    return {

        frequentlyUsesVar,

        improvingVarUsage,

        frequentlyCreatesLargeFunctions,

        excessiveConsoleLogs,

        increasingComplexity,

        usesModernJavascript,

        inconsistentErrorHandling,

        modularizationTrend,

        complexityTrend
    };
}

module.exports = {
    analyzeDeveloperBehavior
};