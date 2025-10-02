//import { MiniMaple } from "./miniMaple";

document.addEventListener('DOMContentLoaded', setup);

function setup() {
    document.getElementById('DiffButton').onclick = addSomething;
}

function addSomething() {
    const someDummyDiv = document.createElement('div');
    someDummyDiv.classList.add('generated');
    const splitInput = document.getElementById('function').value.split(',').map(function (str) { str.replaceAll(" ", "") });
    if (splitInput.length != 2) {
        alert("Error, incorrect number of inputs");
        return;
    }
    else {
        alert("AAA")
        //const solver = MiniMaple();
        //const res = solver.differentiate(0);
        //someDummyDiv.innerHTML = res;
        const container = document.getElementById('container');
        container.insertBefore(someDummyDiv, container.firstChild);
    }
}