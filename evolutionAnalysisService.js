function analyzeEvolution(history) {

    if (!history || history.length < 2) {

        return {
            varEvolution: "stable",
            complexityEvolution: "stable",
            modularizationEvolution: "stable",
            errorHandlingEvolution: "stable",
            modernizationEvolution: "stable"
        };
    }

    const latest = history[0];
    const oldest = history[history.length - 1];

    // =========================
    // VAR
    // =========================

    let varEvolution = "stable";

    if ((latest.varCount || 0) < (oldest.varCount || 0)) {
        varEvolution = "improving";
    }

    if ((latest.varCount || 0) > (oldest.varCount || 0)) {
        varEvolution = "worsening";
    }

    // =========================
    // COMPLEXIDADE
    // =========================

    let complexityEvolution = "stable";

    if (
        (latest.maxNestingLevel || 0) >
        (oldest.maxNestingLevel || 0)
    ) {
        complexityEvolution = "worsening";
    }

    if (
        (latest.maxNestingLevel || 0) <
        (oldest.maxNestingLevel || 0)
    ) {
        complexityEvolution = "improving";
    }

    // =========================
    // MODULARIZAÇÃO
    // =========================

    let modularizationEvolution = "stable";

    if (
        (latest.functionCount || 0) >
        (oldest.functionCount || 0)
    ) {
        modularizationEvolution = "improving";
    }

    if (
        (latest.functionCount || 0) <
        (oldest.functionCount || 0)
    ) {
        modularizationEvolution = "worsening";
    }

    // =========================
    // TRATAMENTO DE ERRO
    // =========================

    let errorHandlingEvolution = "stable";

    if (
        (latest.tryCatchCount || 0) >
        (oldest.tryCatchCount || 0)
    ) {
        errorHandlingEvolution = "improving";
    }

    if (
        (latest.tryCatchCount || 0) <
        (oldest.tryCatchCount || 0)
    ) {
        errorHandlingEvolution = "worsening";
    }

    // =========================
    // JAVASCRIPT MODERNO
    // =========================

    const latestModernScore =
        (latest.constCount || 0) +
        (latest.arrowFunctionCount || 0);

    const oldestModernScore =
        (oldest.constCount || 0) +
        (oldest.arrowFunctionCount || 0);

    let modernizationEvolution = "stable";

    if (latestModernScore > oldestModernScore) {
        modernizationEvolution = "improving";
    }

    if (latestModernScore < oldestModernScore) {
        modernizationEvolution = "worsening";
    }

    return {
        varEvolution,
        complexityEvolution,
        modularizationEvolution,
        errorHandlingEvolution,
        modernizationEvolution
    };
}

module.exports = {
    analyzeEvolution
};