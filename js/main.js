import {
    getProducts
} from './ajax.js';

const url = './mocks/products.json';

window.addEventListener('load', () => {

});

var productList = [];
var selectedProducts = [];

document.getElementById("toogleForm").addEventListener('click', e => {
    $(e.target.nextElementSibling).slideToggle()
})

document.getElementById("startBtn").addEventListener('click', async (e) => {
    /* Usar esta sentencia para ralentizar la petición ajax*/
    await new Promise(r => setTimeout(r, 1000));
    productList = await getProducts(url);
    console.log(productList);
})

function showProduct(product) {
    //Usar esta función para pintar cada producto siguiendo los requisitos del enunciado
}