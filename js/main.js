import {
    getProducts
} from './ajax.js';

const url = './mocks/products.json';

const starterZone = document.getElementsByClassName('starter')[0];
const consumedProducts = document.getElementById('consumedProducts');
const nav = document.getElementsByTagName('nav')[0];

window.addEventListener('load', () => {

});

var productList = [];
var selectedProducts = [];

document.getElementById("toogleForm").addEventListener('click', e => {
    $(e.target.nextElementSibling).slideToggle()
})

document.getElementById("startBtn").addEventListener('click', async (e) => {
    await new Promise(r => {
        setTimeout(r, 3000);
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
        nav.style.display = "block";
        loadEvents();
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
    console.clear();
    let properties = selectedProducts.reduce((acum, current)=>{
        acum.fats += parseInt(current.grasas);
        acum.hydrates += parseInt(current.hidratos);
        acum.proteins += parseInt(current.proteinas);
        return acum;
    },{fats: 0, hydrates: 0, proteins: 0});
    console.log('Información nutricional:');
    console.log(`Grasas: ${properties.fats}`);
    console.log(`Hidratos: ${properties.hydrates}`);
    console.log(`Proteínas: ${properties.proteins}`);
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

function validateCode(target) {
    let errorZone = target.nextElementSibling;
    target.classList.remove('success-field');
    target.classList.remove('error-field');
    errorZone.textContent = '';
    let existProduct = productList.find(product => target.value == product.id);
    if (target.validity.valueMissing) {
        target.classList.add('error-field');
        errorZone.textContent = 'Campo obligatorio.';
    } else if (target.validity.patternMismatch) {
        target.classList.add('error-field');
        errorZone.textContent = 'El código ha de ser un número de tres cifras que empiece por 1.';
    } else if (typeof existProduct != 'undefined') {
        target.classList.add('error-field');
        errorZone.textContent = 'Este código ya existe, pruebe con otro.';
    } else {
        target.classList.add('success-field');
    }
}

function validateName(target) {
    let errorZone = target.nextElementSibling;
    target.classList.remove('success-field');
    target.classList.remove('error-field');
    errorZone.textContent = '';
    if (target.validity.valueMissing) {
        target.classList.add('error-field');
        errorZone.textContent = 'Campo obligatorio.';
    } else if (target.validity.patternMismatch) {
        target.classList.add('error-field');
        errorZone.textContent = 'El nombre ha de tener más de 3 letras.';
    } else {
        target.classList.add('success-field');
    }
}

function validateProperties(target) {
    let errorZone = target.nextElementSibling;
    target.classList.remove('success-field');
    target.classList.remove('error-field');
    errorZone.textContent = '';
    if (target.validity.valueMissing) {
        target.classList.add('error-field');
        errorZone.textContent = 'Campo obligatorio.';
    } else if (target.value < 1) {
        target.classList.add('error-field');
        errorZone.textContent = 'El valor mínimo es 1.';
    } else {
        target.classList.add('success-field');
    }
}

async function validateForm() {
    let fails = 0;
    let code = document.getElementById('code');
    let name = document.getElementById('name');
    let fat = document.getElementById('fat');
    let hydrates = document.getElementById('hydrates');
    let protein = document.getElementById('protein');
    if (!code.validity.valid) {
        validateCode(code);
        fails++;
    }
    if (!name.validity.valid) {
        validateName(name);
        fails++;
    }
    if (!fat.validity.valid) {
        validateProperties(fat);
        fails++;
    }
    if (!hydrates.validity.valid) {
        validateProperties(hydrates);
        fails++;
    }
    if (!protein.validity.valid) {
        validateProperties(protein);
        fails++;
    }
    if (fails == 0) {
        let product = {
            id: code.value,
            name: name.value,
            grasas: fat.value,
            hidratos: hydrates.value,
            proteinas: protein.value
        }
        await new Promise(r => {
            setTimeout(r, 3000);
            productList.push(product);
            code.value = '';
            name.value = '';
            fat.value = '';
            hydrates.value = '';
            protein.value = '';
            code.classList.remove('success-field');
            name.classList.remove('success-field');
            fat.classList.remove('success-field');
            hydrates.classList.remove('success-field');
            protein.classList.remove('success-field');
            document.getElementsByTagName('form')[0].children[2].firstElementChild.disabled = true;
            document.getElementsByTagName('form')[0].children[2].firstElementChild.textContent = 'Cargando...';
        });
        starterZone.parentNode.appendChild((showProduct(product)));
        document.getElementsByTagName('form')[0].children[2].firstElementChild.disabled = false;
        document.getElementsByTagName('form')[0].children[2].firstElementChild.textContent = 'Añadir';
        loadJquery();
    }
}

function loadEvents() {
    document.getElementById('code').addEventListener('input', (e) => {
        validateCode(e.target);
    });
    document.getElementById('name').addEventListener('input', (e) => {
        validateName(e.target);
    });
    document.getElementById('fat').addEventListener('input', (e) => {
        validateProperties(e.target);
    });
    document.getElementById('hydrates').addEventListener('input', (e) => {
        validateProperties(e.target);
    });
    document.getElementById('protein').addEventListener('input', (e) => {
        validateProperties(e.target);
    });
    document.getElementsByTagName('form')[0].addEventListener('submit', (e) => {
        validateForm();
        e.preventDefault();
    })
}
