import {
    getProducts
} from './ajax.js';

const url = './mocks/products.json';

const starterZone = document.getElementsByClassName('starter')[0];

window.addEventListener('load', () => {

});

var productList = [];
var selectedProducts = [];

document.getElementById("toogleForm").addEventListener('click', e => {
    $(e.target.nextElementSibling).slideToggle()
})

document.getElementById("startBtn").addEventListener('click', async (e) => {
    /* Usar esta sentencia para ralentizar la petición ajax*/
    await new Promise(r => {
        setTimeout(r, 1000);
        loader(starterZone, true);
    });
    productList = await getProducts(url);
    if (productList == null) {
        starterZone.children[1].style.display = "none";
        starterZone.children[2].style.display = "block";
    } else {
        loader(starterZone, false);
        productList.forEach(product => {
            starterZone.parentNode.appendChild((showProduct(product)));
        });
    }
})

function showProduct(product) {
    let template = document.getElementsByTagName('template')[0].content.cloneNode(true);
    let agrupador = template.firstElementChild;
    agrupador.textContent = product.name;
    agrupador.dataset.code = product.id;
    agrupador.classList.add('draggable');
    return agrupador;
}

function loader(zone, option) {
    if (option) {
        zone.children[1].style.display = "block";
    } else {
        zone.children[1].style.display = "none";
        zone.style.display = "none";
    }

}