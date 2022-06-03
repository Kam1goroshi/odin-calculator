/**
 * A queue node for the calculator. 
 */
class CalNode {
    constructor(value, acceptsDot, isOperand) {
        this.value = value;
        this.isOperand = isOperand;
        this.acceptsDot = acceptsDot;
        this.next = null;
        this.prev = null;
    }

    addNext(value, isOperand) {
        if (value === '.' && this.acceptsDot) { //Add a dot and don't allow more dots
            this.next = new CalNode(value, false, isOperand);
            this.next.prev = this;
            return true;
        } else if (isOperand && !isNaN(this.value)) { //Add an operand and allow dots
            this.next = new CalNode(value, true, isOperand);
            this.next.prev = this;
            return true;
        } else if (!isNaN(value)) { //Add a number, and allow dot if dot was allowed here
            this.next = new CalNode(value, this.acceptsDot, isOperand);
            this.next.prev = this;
            return true;
        }
        return false;
    }
}

class Calculator {
    constructor(displayElement) {
        this.displayElement = displayElement;
        this.head = null;
        this.tail = null;
    }

    erase(){
        while(this.head){
            this.del();
        }
    }

    del() {
        if (this.tail === null)
            return;
        if (this.tail === this.head) {
            this.displayElement.textContent = "";
            this.tail = null;
            this.head = null;
            return;
        }
        this.tail = this.tail.prev;
        this.tail.next.prev = null;
        this.tail.next = null;
        this.displayElement.textContent = this.displayElement.textContent.substring(0, this.displayElement.textContent.length - 1);
    }

    addInput(value) {
        const isInputOperand = (value === '+' || value === '-' || value === '*' || value === '/');
        if (this.head === null) {
            if (isNaN(value) && (value !== '+' && value !== '-' && value !== '.'))
                return;
            this.head = new CalNode(value, value !== '.', isInputOperand);
            this.tail = this.head;
            this.displayElement.textContent += value;
            return;
        }
        if (isInputOperand && this.tail.isOperand) {
            this.tail.value = value;
            this.displayElement.textContent = this.displayElement.textContent.substring(0, this.displayElement.textContent.length - 1)
            this.displayElement.textContent += value;
        }
        if (this.tail.addNext(value, isInputOperand)) {
            this.displayElement.textContent += value;
            this.tail = this.tail.next;
        }
    }

    toString() {
        let output = "";
        let iter = this.head;
        while (iter) {
            output = output.concat(iter.value)
            iter = iter.next;
        }
        return output;
    }
}

const displayElement = document.getElementById('display');
let calculator = new Calculator(displayElement);

const getInput = (input) => {
    if (input == 'del')
        calculator.del();
    else if (input == 'c')
        calculator.erase();
    else
        calculator.addInput(input);
    console.log(calculator.toString());
}
//Bind actions, the lazy way, no need to hard code
//If needed improve later
let bindKeys = () => {
    for (let i = 0; i <= 9; i++) {
        document.getElementById(`b${i}`).addEventListener("click", (event) => {
            getInput(`${i}`);
        })
    }
    tmpArray = new Array('+', '-', '/', '=', '*', 'del', '.', 'c');
    tmpArray.forEach(element => {
        document.getElementById(`b${element}`).addEventListener("click", (event) => {
            getInput(`${element}`);
        })
    });
    const queryClick = (id) => {
        document.getElementById(id).click();
    }
    const body = document.querySelector('body');
    body.addEventListener('keydown', (key) => {
        let str = key.key;
        switch (key.key) {
            case '+':
                str = 'add';
                break;
            case '-':
                str = 'sub';
                break;
            case '*':
                str = 'mul';
                break;
            case '/':
                str = 'div';
                break;
            case '.':
                str = 'dot';
                break;
        }
        const element = document.querySelector(`.k${str}`);
        if (element)
            element.click();
    })
}

bindKeys();