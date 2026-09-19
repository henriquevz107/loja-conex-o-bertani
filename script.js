/* =========================================
   CONEXÃO BERTANI
   SCRIPT DO SITE
========================================= */


/* =========================================
   CONFIGURAÇÕES
========================================= */

const WHATSAPP = "551120172618";

let carrinho = [];

let categoriaAtual = "todos";


/* =========================================
   MENU MOBILE
========================================= */

function toggleMenu() {

    const nav = document.getElementById("nav");

    nav.classList.toggle("open");

}


/* Fecha o menu quando clicar em um link */

document.querySelectorAll("#nav a").forEach(link => {

    link.addEventListener("click", () => {

        document.getElementById("nav").classList.remove("open");

    });

});


/* =========================================
   CARRINHO
========================================= */

function adicionarCarrinho(nome, preco) {

    const produtoExistente = carrinho.find(
        item => item.nome === nome
    );


    if (produtoExistente) {

        produtoExistente.quantidade++;

    } else {

        carrinho.push({

            nome: nome,

            preco: Number(preco),

            quantidade: 1

        });

    }


    atualizarCarrinho();

    abrirCarrinho();


    /* Pequena mensagem */

    mostrarMensagem(
        "Produto adicionado ao carrinho 🛒"
    );

}


/* =========================================
   ATUALIZAR CARRINHO
========================================= */

function atualizarCarrinho() {

    const cartItems =
        document.getElementById("cartItems");

    const cartCount =
        document.getElementById("cartCount");

    const cartTotal =
        document.getElementById("cartTotal");


    /* Quantidade total */

    const quantidadeTotal = carrinho.reduce(

        (total, item) =>
            total + item.quantidade,

        0

    );


    cartCount.textContent = quantidadeTotal;


    /* Carrinho vazio */

    if (carrinho.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <span>🛒</span>

                <h3>
                    Carrinho vazio
                </h3>

                <p>
                    Adicione produtos para montar seu pedido.
                </p>

            </div>

        `;

        cartTotal.textContent =
            formatarPreco(0);

        return;

    }


    /* Renderizar produtos */

    cartItems.innerHTML = "";


    carrinho.forEach((item, index) => {

        const elemento =
            document.createElement("div");

        elemento.className = "cart-item";


        elemento.innerHTML = `

            <div class="cart-item-info">

                <strong>
                    ${item.nome}
                </strong>

                <span>
                    ${formatarPreco(item.preco)}
                    cada
                </span>

            </div>


            <div class="quantity">

                <button
                    onclick="diminuirQuantidade(${index})">
                    −
                </button>

                <strong>
                    ${item.quantidade}
                </strong>

                <button
                    onclick="aumentarQuantidade(${index})">
                    +
                </button>

            </div>


            <button
                class="remove"
                onclick="removerProduto(${index})"
                title="Remover">

                ✕

            </button>

        `;


        cartItems.appendChild(elemento);

    });


    /* Calcular total */

    const total = carrinho.reduce(

        (soma, item) =>

            soma +
            (item.preco * item.quantidade),

        0

    );


    cartTotal.textContent =
        formatarPreco(total);

}


/* =========================================
   AUMENTAR QUANTIDADE
========================================= */

function aumentarQuantidade(index) {

    carrinho[index].quantidade++;

    atualizarCarrinho();

}


/* =========================================
   DIMINUIR QUANTIDADE
========================================= */

function diminuirQuantidade(index) {

    if (
        carrinho[index].quantidade > 1
    ) {

        carrinho[index].quantidade--;

    } else {

        carrinho.splice(index, 1);

    }


    atualizarCarrinho();

}


/* =========================================
   REMOVER PRODUTO
========================================= */

function removerProduto(index) {

    carrinho.splice(index, 1);

    atualizarCarrinho();

}


/* =========================================
   LIMPAR CARRINHO
========================================= */

function limparCarrinho() {

    if (carrinho.length === 0) {

        return;

    }


    const confirmar =
        confirm(
            "Deseja limpar o carrinho?"
        );


    if (confirmar) {

        carrinho = [];

        atualizarCarrinho();

    }

}


/* =========================================
   ABRIR CARRINHO
========================================= */

function abrirCarrinho() {

    const overlay =
        document.getElementById("cartOverlay");

    overlay.classList.add("open");

    document.body.style.overflow = "hidden";

}


/* =========================================
   FECHAR CARRINHO
========================================= */

function fecharCarrinho(event) {

    if (
        event &&
        event.target !== event.currentTarget
    ) {

        return;

    }


    const overlay =
        document.getElementById("cartOverlay");

    overlay.classList.remove("open");

    document.body.style.overflow = "";

}


/* =========================================
   FORMATAR PREÇO
========================================= */

function formatarPreco(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/* =========================================
   FINALIZAR PEDIDO
========================================= */

function finalizarPedido() {

    if (carrinho.length === 0) {

        mostrarMensagem(
            "Seu carrinho está vazio 🛒"
        );

        return;

    }


    let mensagem =
        "Olá! 👋 Vim pelo site da Conexão Bertani.%0A%0A";

    mensagem +=
        "🛒 *MEU PEDIDO*%0A%0A";


    let total = 0;


    carrinho.forEach(item => {

        const subtotal =
            item.preco * item.quantidade;

        total += subtotal;


        mensagem +=
            `📱 ${item.nome}%0A`;

        mensagem +=
            `Quantidade: ${item.quantidade}%0A`;

        mensagem +=
            `Valor: ${formatarPreco(item.preco)}%0A`;

        mensagem +=
            `Subtotal: ${formatarPreco(subtotal)}%0A%0A`;

    });


    mensagem +=
        `💰 *TOTAL: ${formatarPreco(total)}*%0A%0A`;

    mensagem +=
        "Gostaria de confirmar a disponibilidade e combinar a retirada/entrega. 😊";


    const url =
        `https://wa.me/${WHATSAPP}?text=${mensagem}`;


    window.open(
        url,
        "_blank"
    );

}


/* =========================================
   FILTRO POR CATEGORIA
========================================= */

function filtrarCategoria(
    categoria,
    botao
) {

    categoriaAtual = categoria;


    /* Ativar botão */

    document
        .querySelectorAll(".category")
        .forEach(btn => {

            btn.classList.remove("active");

        });


    if (botao) {

        botao.classList.add("active");

    }


    filtrarProdutos();

}


/* =========================================
   BUSCA + FILTRO
========================================= */

function filtrarProdutos() {

    const campo =
        document.getElementById("search");

    const pesquisa =
        campo.value
            .toLowerCase()
            .trim();


    const produtos =
        document.querySelectorAll(".product");


    produtos.forEach(produto => {

        const categoria =
            produto.dataset.category;

        const nome =
            produto.dataset.name
                .toLowerCase();


        const correspondeCategoria =

            categoriaAtual === "todos" ||

            categoria === categoriaAtual;


        const correspondePesquisa =

            nome.includes(pesquisa);


        if (
            correspondeCategoria &&
            correspondePesquisa
        ) {

            produto.style.display = "";

        } else {

            produto.style.display = "none";

        }

    });

}


/* =========================================
   MENSAGEM TEMPORÁRIA
========================================= */

function mostrarMensagem(texto) {

    const antiga =
        document.querySelector(".toast");

    if (antiga) {

        antiga.remove();

    }


    const toast =
        document.createElement("div");

    toast.className = "toast";

    toast.textContent = texto;


    document.body.appendChild(toast);


    setTimeout(() => {

        toast.classList.add("show");

    }, 10);


    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 2200);

}


/* =========================================
   ESTILO DA NOTIFICAÇÃO
========================================= */

const toastStyle =
document.createElement("style");

toastStyle.innerHTML = `

.toast {

    position: fixed;

    left: 50%;

    bottom: 25px;

    transform:
        translate(-50%, 30px);

    padding:
        13px 20px;

    background:
        #00a8d6;

    color:
        #001017;

    border-radius:
        10px;

    font-size:
        12px;

    font-weight:
        800;

    opacity:
        0;

    transition:
        .3s;

    z-index:
        9999;

    box-shadow:
        0 10px 30px rgba(0,0,0,.4);

}


.toast.show {

    opacity:
        1;

    transform:
        translate(-50%, 0);

}

`;

document.head.appendChild(toastStyle);


/* =========================================
   TECLA ESC FECHA CARRINHO
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            fecharCarrinho();

        }

    }
);


/* =========================================
   INICIALIZAÇÃO
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        atualizarCarrinho();

    }
);