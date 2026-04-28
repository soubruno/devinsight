function analyzePatterns(history) {
    if (!history || history.length < 2) {
        return {
            varTrend: 0,
            functionTrend: 0,
            lastVarCount: null,
            previousVarCount: null
        };
    }

    const last = history[0];
    const previous = history[1];

    return {
        varTrend: last.varCount - previous.varCount,
        functionTrend: last.functionCount - previous.functionCount,
        lastVarCount: last.varCount,
        previousVarCount: previous.varCount
    };
}

module.exports = { analyzePatterns };