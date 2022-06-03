getInput(input){
    console.log(input);
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
        }
        const element = document.querySelector(`.k${str}`);
        if (element)
            element.click();
    })
}

bindKeys();