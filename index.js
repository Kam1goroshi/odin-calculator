class StackNode{
    constructor(item){
        this.item = item;
        this.next = null;
        this.prev = null;
    }
    setPrev(){
        return this.prev;
    }
    getNext(){
        return this.next;
    }
    setNext(next){
        this.next = next;
    }
    setPrev(prev){
        this.prev = prev;
    }
}
class DigitStack{
    constructor(){
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    push(digit){
        if(!this.size){
            this.head = new StackNode(digit);
            this.tail = this.head;
        }else if(this.size === 1){
            this.tail = new StackNode(digit);
            this.head.setNext(this.tail);
            this.tail.setPrev(this.head);
        }else{
            this.tail.setNext(new StackNode(digit));
            this.tail.getNext().setPrev(this.tail);
            this.tail = this.tail.getNext();
        }
        this.size++;
    }
    pop(){
        let output = null;
        this.size--;
        if(this.size === 0){
            output = this.head;
            this.head = null;
            this.tail = null;
        }else if(this.size === 1){
            output = this.tail;
            output.setPrev(null);
            this.tail = this.head;
        }else{
            output = this.tail;
            this.tail = this.tail.getPrev();
            output.setPrev(null);
        }
        return output;
    }

    popReverse(){
        let output = null;
        this.size--;
        if(this.size === 0){
            output = this.head;
            this.head = null;
            this.tail = null;
        }else if(this.size === 1){
            output = this.head;
            output.setNext(null);
            this.head = this.tail;
        }else{
            output = this.head;
            this.head = this.head.getNext();
            output.setNext(null);
        }
        return output;
    }

    isEmpty(){
        return this.size === 0;
    }

    toNumber(){
        let number = "";
        while(!this.isEmpty()){
            number += this.popReverse().item;
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



//test digitstack
const digitStack = new DigitStack();
digitStack.push(5);
digitStack.push('.');
digitStack.push(4);
console.log(digitStack.toNumber());
console.log(digitStack.toNumber());
/**
My idea is that I will have a singleton which remembers 3 numbers and 3
operators and will only execute operations on 2 numbers at a time.

Scenarios:
1. num.., add/sub, num.., add/sum/equals: 
    keep result and operand
2. num.., mult/div, num: 
    keep result
3. num.., add/sub, num.., mult/div, num..: 
    keep first number, first operand, result of mult/div
 */