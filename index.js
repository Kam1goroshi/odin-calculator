class StackNode {
    constructor(item) {
        this.item = item;
        this.next = null;
        this.prev = null;
    }
    getPrev() {
        return this.prev;
    }
    getNext() {
        return this.next;
    }
    setNext(next) {
        this.next = next;
    }
    setPrev(prev) {
        this.prev = prev;
    }
}
class DigitStack {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    push(digit) {
        if (!this.size) {
            this.head = new StackNode(digit);
            this.tail = this.head;
        } else if (this.size === 1) {
            this.tail = new StackNode(digit);
            this.head.setNext(this.tail);
            this.tail.setPrev(this.head);
        } else {
            this.tail.setNext(new StackNode(digit));
            this.tail.getNext().setPrev(this.tail);
            this.tail = this.tail.getNext();
        }
        this.size++;
    }
    peek() {
        return this.tail.item;
    }
    reversePeek() {
        return this.head.item;
    }
    pop() {
        let output = null;
        this.size--;
        if (this.size === 0) {
            output = this.head;
            this.head = null;
            this.tail = null;
        } else if (this.size === 1) {
            output = this.tail;
            output.setPrev(null);
            this.tail = this.head;
        } else {
            output = this.tail;
            this.tail = this.tail.getPrev();
            output.setPrev(null);
        }
        return output.item;
    }

    popReverse() {
        let output = null;
        this.size--;
        if (this.size === 0) {
            output = this.head;
            this.head = null;
            this.tail = null;
        } else if (this.size === 1) {
            output = this.head;
            output.setNext(null);
            this.head = this.tail;
        } else {
            output = this.head;
            this.head = this.head.getNext();
            output.setNext(null);
        }
        return output.item;
    }

    isEmpty() {
        return this.size === 0;
    }

    toNumber() {
        let number = "";
        while (!this.isEmpty()) {
            number += this.popReverse();
        }
        return number == "" ? 0 : parseFloat(number);
    }
}

const areInputsDefined = (a, b) => {
    if (a === undefined || b === undefined)
        return undefined;
}

const add = (a, b) => {
    if (areInputsDefined(a, b))
        return undefined;
    return a + b;
}

const subtract = (a, b) => {
    if (areInputsDefined(a, b))
        return undefined;
    return a + b;
}

const divide = (a, b) => {
    if (areInputsDefined(a, b) || b == 0)
        return undefined;
}

const multiply = (a, b) => {
    if (areInputsDefined(a, b))
        return undefined;
    return a * b;
}


let acceptDot = true;
const digitStack1 = new DigitStack();
const digitStack2 = new DigitStack();
const digitStack3 = new DigitStack();

/**
 * Common input state machine for every position "? op ? op ?"
 * If the stack is empty, it accepts '-' and doesn't accept 0
 * If it receives del it deletes a character instead of pushing something to the stack
 * @param {',', 'del', '.', R, '-'} input calculator operation
 * @param {DigitStack} stack the input stack
 * @returns true upon using an input
 */
const getInputHelper = (input, stack) => {
    if (input === 'del') {
        if (stack.isEmpty())
            return true;
        if (stack.pop() === '.') {
            acceptDot = true;
        }
        return true;
    } else if (stack.isEmpty()) {
        if ((!isNaN(input) && input !== 0) || input === '-') {
            stack.push(input);
            return true;
        }
    } else if (!isNaN(input)) {
        stack.push(input);
        return true;
    } else if (input === '.' && acceptDot === true) {
        stack.push('.');
        acceptDot = false;
        return true;
    }
    return false;
}
/**
 * Part of the input state machine.
 * State: expecting a and op1 in "a op1 b op2 c op3". Simplified, the first number.
 * If op1 is add/sub then we move to the state without priority in order to be able to receive C too
 * If op1 is div/mult then we move to the state with priority where a div/mult b should happen
 * @param {'del', '.', '/', '*', '-', num} input calculator operation
 */
const getFirstNumberInput = (input) => {
    if (!getInputHelper(input, digitStack1) && (digitStack1.size > 1)) {
        if (input === '+' || input === '-') {
            digitStack2.push(input);
            getInput = getSecondNumberInput;
        } else if (input === '*' || input === '/') {
            digitStack2.push(input);
            getInput = getPrioritySecondNumberInput;
        }
    }
}

/**
 * Part of the input state machine.
 * State: expecting b and op2 in "a op1 b op2 c op3". Simplified, the second number.
 * If op2 is add/sub then "a op1 b" is calculated into a, and op1 becomes op2
 * If op2 is div/mult then we move to the state where c and op3 are expected 
 * @param {'del', '.', '/', '*', '-', num} input calculator operation
 */
const getSecondNumberInput = (input) => {
    if (!getInputHelper(input, digitStack2) && (digitStack2.size > 1)) {
        if (input === '+' || input === '-') {
            const result = "" + (digitStack1.toNumber() + digitStack2.toNumber());
            for (let i = 0; i < result.length; i++) {
                digitStack1.push(result.charAt(i));
            }
            digitStack2.push(input);
        } else if (input === '*' || input === '/') {
            digitStack3.push(input);
            getInput = getThirdNumberInput;
        }
    } else if (digitStack2.isEmpty()) {
        getInput = getFirstNumberInput;
    }
}

/**
 * Part of the input state machine.
 * State: expecting b and op2 in "a op1 b op2 c op3" with priority. 
 * Simplifying state: the second number, but regardless of the next stage, calculate "a op1 b" 
 * and return to this state, or the no-priority version of it.
 * If op2 is add/sub then "a op1 b" is calculated and the machine moves to non-priority version
 * If op2 is div/mult then we move to the state where c and op3 are expected
 * a always becomes the result, op1 becomes op2
 * @param {'del', '.', '/', '*', '-', num} input calculator operation
 */
const getPrioritySecondNumberInput = (input) => {
    if (!getInputHelper(input, digitStack2) && (digitStack2.size > 1)) {
        if (input === '+' || input === '-' || input === '*' || input === '/') {
            const op = digitStack2.popReverse();
            let result = "";
            if (op === '*') {
                result += (digitStack1.toNumber() * digitStack2.toNumber());
            } else if (op === '/') {
                result += (digitStack1.toNumber() / digitStack2.toNumber());
            }
            for (let i = 0; i < result.length; i++) {
                digitStack1.push(result.charAt(i));
            }
            digitStack2.push(input);
            //Remove priority, now the calculator is in a+.. state
            if (input === '+' || input === '-')
                getInput = getSecondNumberInput;
        }
    } else if (digitStack2.isEmpty()) {
        getInput = getFirstNumberInput;
    }
}

/**
 * Part of the input state machine.
 * State: expecting c and op3 in "a op1 b op2 c op3" with priority (assignment limitation: only 1 operation at a time). 
 * I barely break the limitation when receiving "a add/sub b mul/div c add/sub" in order to keep calculating after receing operations
 * Simplifying state: the third number and operand, calculate b op2 c, onto b. 
 * If op3 is add/sub, calculate a op1 b' onto a, op1 becomes op3 and move to second input state without priority.
 * If op3 is div/mult op2 becomes op3
 * @param {'del', '.', '/', '*', '-', num} input calculator operation
 */
const getThirdNumberInput = (input) => {
    if (!getInputHelper(input, digitStack3) && (digitStack3.size > 1)) {
        if (input === '*' || input === '/' || input === '+' || input === '-' ) {
            const op = digitStack3.popReverse();
            let result = "";
            if (op === '*') {
                result += (digitStack2.toNumber() * digitStack3.toNumber());
            } else if (op === '/') {
                result += (digitStack2.toNumber() / digitStack3.toNumber());
            }
            for (let i = 0; i < result.length; i++) {
                digitStack2.push(result.charAt(i));
            }
            if(input === '+' || input === '-'){
                result = "" + (digitStack1.toNumber() + digitStack2.toNumber());
                console.log("res: "+ result)
                digitStack2.push(input);
                for (let i = 0; i < result.length; i++) {
                    digitStack1.push(result.charAt(i));
                }
                getInput = getSecondNumberInput;
            }
        }
    } else if (digitStack3.isEmpty()) {
        getInput = getSecondNumberInput;
    }
}
let getInput = getFirstNumberInput;