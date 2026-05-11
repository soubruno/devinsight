const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

function analyzeCode(sourceCode) {

    const metrics = {
        functionCount: 0,
        arrowFunctionCount: 0,
        asyncFunctionCount: 0,

        varCount: 0,
        letCount: 0,
        constCount: 0,

        consoleLogCount: 0,

        tryCatchCount: 0,

        ifCount: 0,
        loopCount: 0,

        maxNestingLevel: 0,

        largeFunctions: [],

        duplicatedStrings: {},

        averageFunctionSize: 0,

        functionSizes: []
    };

    try {

        const ast = parser.parse(sourceCode, {
            sourceType: "module",
            plugins: [
                "jsx",
                "asyncGenerators",
                "classProperties"
            ]
        });

        traverse(ast, {

            FunctionDeclaration(path) {

                metrics.functionCount++;

                analyzeFunction(path, metrics);
            },

            ArrowFunctionExpression(path) {

                metrics.functionCount++;
                metrics.arrowFunctionCount++;

                analyzeFunction(path, metrics);
            },

            VariableDeclaration(path) {

                if (path.node.kind === "var") {
                    metrics.varCount++;
                }

                if (path.node.kind === "let") {
                    metrics.letCount++;
                }

                if (path.node.kind === "const") {
                    metrics.constCount++;
                }
            },

            CallExpression(path) {

                const callee = path.node.callee;

                if (
                    callee.type === "MemberExpression" &&
                    callee.object &&
                    callee.object.type === "Identifier" &&
                    callee.object.name === "console"
                ) {
                    metrics.consoleLogCount++;
                }
            },

            TryStatement() {
                metrics.tryCatchCount++;
            },

            IfStatement(path) {

                metrics.ifCount++;

                const nesting = getNestingLevel(path);

                if (nesting > metrics.maxNestingLevel) {
                    metrics.maxNestingLevel = nesting;
                }
            },

            ForStatement() {
                metrics.loopCount++;
            },

            WhileStatement() {
                metrics.loopCount++;
            },

            StringLiteral(path) {

                const value = path.node.value;

                if (!metrics.duplicatedStrings[value]) {
                    metrics.duplicatedStrings[value] = 1;
                } else {
                    metrics.duplicatedStrings[value]++;
                }
            }
        });

        calculateAverageFunctionSize(metrics);

        return metrics;

    } catch (error) {

        console.error("Erro ao analisar código:", error);

        return metrics;
    }
}

function analyzeFunction(path, metrics) {

    const start = path.node.loc?.start?.line || 0;
    const end = path.node.loc?.end?.line || 0;

    const size = end - start;

    metrics.functionSizes.push(size);

    if (size >= 15) {

        metrics.largeFunctions.push({
            name: path.node.id?.name || "Função anônima",
            size
        });
    }

    if (path.node.async) {
        metrics.asyncFunctionCount++;
    }
}

function calculateAverageFunctionSize(metrics) {

    if (metrics.functionSizes.length === 0) {
        metrics.averageFunctionSize = 0;
        return;
    }

    const total = metrics.functionSizes.reduce((a, b) => a + b, 0);

    metrics.averageFunctionSize =
        Math.round(total / metrics.functionSizes.length);
}

function getNestingLevel(path) {

    let level = 0;

    let current = path.parentPath;

    while (current) {

        if (
            current.isIfStatement() ||
            current.isForStatement() ||
            current.isWhileStatement()
        ) {
            level++;
        }

        current = current.parentPath;
    }

    return level;
}

module.exports = { analyzeCode };