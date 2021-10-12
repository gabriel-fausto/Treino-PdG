let dados = [];
let categorias = ["prato-principal", "entrada", "sobremesa", "pao"];
let classesCategoria = {
    "sobremesa": ["mt-3", "mt-sm-2", "mt-md-1"],
    "prato-principal": ["mt-3", "mt-sm-2", "mt-md-1", "mt-lg-3"],
}
iniciarTela();

const estilosCabecalhoModal = ["modal--prato-principal", "modal--entrada",
    "modal--sobremesa", "modal--pao"];

const porCategoriaEDisponibilidade = categoria => prato => categoria === prato.categoriaPrato && prato.disponivel;

const porNome = nome => prato => nome === prato.nomePrato;

const reduzirAvaliacao = (avaliacoesAnteriores, avaliacao) => avaliacoesAnteriores + avaliacao;

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

        elementoLi.addEventListener("click", (event) => exibirInfo(event.target.innerText));
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

//#region modal
function exibirInfo(prato) {
    let dadosPrato = dados.find(porNome(prato));

    limpaModal();

    elemento("modal--cabecalho").classList.add("modal--" + dadosPrato.categoriaPrato)
    elemento("modal--titulo").innerText = prato;
    elemento("total-estrelas").innerText = calculaEstrelas(dadosPrato.avaliacoes);

    dadosPrato.avaliacoes.forEach(avaliacao => exibirAvaliacao(avaliacao));

    if (dadosPrato.gluten)
        exibir(elemento("aviso-gluten"));
    if (dadosPrato.lactose)
        exibir(elemento("aviso-lactose"));

    elemento("aciona-modal").click();
}

function limpaModal() {
    elemento("modal--avaliacoes").innerHTML = "";
    elemento("modal--cabecalho").classList.remove(...estilosCabecalhoModal);
    esconder(elemento("aviso-gluten"));
    esconder(elemento("aviso-lactose"));
}

function calculaEstrelas(avaliacoes) {
    let estrelas = avaliacoes
        .map(avaliacao => avaliacao.estrelas)
        .reduce(reduzirAvaliacao) / avaliacoes.length;
    return Math.round(estrelas);
}

function exibirAvaliacao(avaliacao) {
    let linhaAvaliacao = criarLinhaAvaliacao();

    linhaAvaliacao.appendChild(criarColunaAvaliacao(avaliacao.estrelas));
    linhaAvaliacao.appendChild(
        criarColunaAutor(avaliacao.autor, avaliacao.comentario));

    elemento("modal--avaliacoes").appendChild(linhaAvaliacao);
}

function criarLinhaAvaliacao() {
    let row = criarElemento("div");
    row.classList.add(...["row", "border-top", "py-2"]);
    return row;
}

function criarColunaAvaliacao(estrelas) {
    let col1 = criarElemento("div");
    let p = criarElemento("p");

    col1.classList.add("col-1");
    p.classList.add(...["fs-2", "mb-0"]);

    p.innerText = estrelas;

    col1.appendChild(p);

    return col1;
}

function criarColunaAutor(autor, comentario) {
    let col11 = criarElemento("div");
    let h6 = criarElemento("h6");
    let p = criarElemento("p");

    col11.classList.add("col-11");
    p.classList.add("mb-0");

    h6.innerText = autor;
    p.innerText = comentario;

    col11.appendChild(h6);
    col11.appendChild(p);

    return col11;
}
//#endregion