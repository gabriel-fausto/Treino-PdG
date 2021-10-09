let dados = [];
let categorias = ["prato-principal", "entrada", "sobremesa", "pao"];
let classesCategoria = {
    "sobremesa": ["mt-3", "mt-sm-2", "mt-md-1"],
    "prato-principal": ["mt-3", "mt-sm-2", "mt-md-1", "mt-lg-3"],
}
iniciarTela();

const porCategoriaEDisponibilidade = categoria => prato => categoria === prato.categoriaPrato && prato.disponivel;

Array.prototype.inserirNa = function (categoria) {
    if (categoria === "entrada") {
        this.splice(Math.round(this.length / 2)).inserirNa(categoria + "-2");
    }

    let classes = classesCategoria[categoria];

    this.forEach(nome => {
        let elementoLi = criarElemento("li");
        elementoLi.innerText = nome;
        if (classes)
            elementoLi.classList.add(...classes)

        elementoLi.addEventListener("click", (event) => console.log(event.target.innerText));
        elemento("lista--" + categoria).appendChild(elementoLi);
    });
}


//#region funcoes auxiliares do DOM
function elemento(id) {
    return document.getElementById(id);
}

function esconder(elemento) {
    elemento.classList.add("d-none");
}

function exibir(elemento) {
    elemento.classList.remove("d-none");
}

function criarElemento(tipo) {
    return document.createElement(tipo);
}

function zerarOpacidadeDo(elemento) {
    elemento.classList.add("opacity-0");
}

function resetarOpacidadeDo(elemento) {
    elemento.classList.remove("opacity-0");
}
//#endregion


async function iniciarTela() {
    await CarregarDados();
    inserirPratosPorCategoria();
}


async function CarregarDados() {
    await fetch("/menu-buffet/js/dados.json")
        .then(response => response.json())
        .then(json => {
            dados = json
        });
}

function inserirPratosPorCategoria() {
    let categoria = categorias.pop();
    if (categoria) {
        let pratos = dados.filter(porCategoriaEDisponibilidade(categoria)).map(prato => prato.nomePrato);

        pratos.inserirNa(categoria);
        inserirPratosPorCategoria();
    }
}