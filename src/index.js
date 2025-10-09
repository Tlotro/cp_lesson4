import { MiniMaple } from "./miniMaple.js";

document.addEventListener('DOMContentLoaded', setup);

function setup() {
    document.getElementById('DiffButton').onclick = addSomething;
}

function addSomething() {
    const someDummyDiv = document.createElement('div');
    someDummyDiv.classList.add('generated');
    const input = document.getElementById('function');
    const splitInput = input.value.split(';').map(str => str.replaceAll(" ", "").toLowerCase());
    if (splitInput.length != 2) {
        alert("Error, incorrect number of inputs");
        return;
    }
    else {
        try{
        const solver = new MiniMaple();
        solver.setVariable(splitInput[1]);
        const container = document.getElementById('container');
        const res = solver.lex(splitInput[0]);
        const res2 = solver.parse();
        const res3 = solver.differentiate(res2);
        const res4 = solver.simplify(res3);
        const res5 = solver.toString(res4);
        someDummyDiv.innerHTML = res5;
        container.insertBefore(someDummyDiv, container.firstChild);
        }
        catch (error)
        {
            alert(error.message)
            alert(error.stack)
        }
    }
}