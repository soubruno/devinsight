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
        varTrend: (last.varCount ?? 0) - (previous.varCount ?? 0),
        functionTrend: (last.functionCount ?? 0) - (previous.functionCount ?? 0),
        lastVarCount: last.varCount,
        previousVarCount: previous.varCount
    };
}

module.exports = { analyzePatterns };