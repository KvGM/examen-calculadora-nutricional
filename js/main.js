import {
    getProducts
} from './ajax.js';

const url = './mocks/products.json';

const starterZone = document.getElementsByClassName('starter')[0];
const consumedProducts = document.getElementById('consumedProducts');

window.addEventListener('load', () => {

});

var productList = [];
var selectedProducts = [];

document.getElementById("toogleForm").addEventListener('click', e => {
    $(e.target.nextElementSibling).slideToggle()
})

document.getElementById("startBtn").addEventListener('click', async (e) => {
    await new Promise(r => {
        setTimeout(r, 1000);
        starterZone.children[2].style.display = "none";
        loader(starterZone, true);
        starterZone.children[0].disabled = true;
    });
    productList = await getProducts(url);
    if (productList == null) {
        starterZone.children[0].disabled = false;
        starterZone.children[1].style.display = "none";
        starterZone.children[2].style.display = "block";
    } else {
        loader(starterZone, false);
        productList.forEach(product => {
            starterZone.parentNode.appendChild((showProduct(product)));
        });
        consumedProducts.classList.add('droppable');
        //mostrar Formulario
        loadJquery();
    }
})

function showProduct(product) {
    let template = document.getElementsByTagName('template')[0].content.cloneNode(true);
    let div = template.firstElementChild;
    div.textContent = product.name;
    div.dataset.code = product.id;
    div.classList.add('draggable');
    return div;
}

function sumProperties() {
    let fats = 0;
    let hydrates = 0;
    let proteins = 0;
    selectedProducts.forEach(product => {
        fats += parseInt(product.grasas);
        hydrates += parseInt(product.hidratos);
        proteins += parseInt(product.proteinas);
    })
    console.log('Información nutricional:');
    console.log(`Grasas: ${fats}`);
    console.log(`Hidratos: ${hydrates}`);
    console.log(`Proteínas: ${proteins}`);
}

function loader(zone, option) {
    if (option) {
        zone.children[1].style.display = "block";
    } else {
        zone.children[1].style.display = "none";
        zone.style.display = "none";
    }
}

function loadJquery() {
    $(".draggable").draggable({
        containment: "#interactive",
        revert: true
    });
    $(".droppable").droppable({
        drop: function (event, ui) {
            let draggableCode = ui.draggable[0].dataset.code;
            let product = productList.find(prodct => draggableCode == prodct.id);
            selectedProducts.push(product);
            sumProperties();
            $(ui.draggable[0]).draggable("option", "revert", false);
            $(ui.draggable[0]).draggable("disable");
        }
    })
}