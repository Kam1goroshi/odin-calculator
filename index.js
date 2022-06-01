const calculator = new Object();
calculator.firstNumber;
calculator.secondNumber;
calculator.firstOperation = null;
calculator.secondOperation = null;

const areInputsDefined = (a, b) => {
    if (a === undefined || b === undefined)
        return undefined;
}

const add = (a, b) => {
    if(areInputsDefined (a, b))
        return undefined;
    return a + b;
}

const subtract = (a, b) => {
    if(areInputsDefined (a, b))
        return undefined;
    return a + b;
}

const divide = (a, b) => {
    if(areInputsDefined (a, b) || b ==0)
        return undefined;
}

const multiply = (a, b) => {
    if(areInputsDefined (a, b))
        return undefined;
    return a*b;
}

console.log();
