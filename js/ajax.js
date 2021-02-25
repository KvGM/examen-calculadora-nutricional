export async function getProducts(url) {
    //return (await fetch(url)).json();
    let options = {
        method: "GET"
    };
    return await fetch(url, options)
        .then(response => response.text())
        .then(data => {
            let resultado = null;
            try {
                return resultado = JSON.parse(data);
            } catch {
                return resultado;
            }
        })
        .catch(error => {
            console.log(error);
        })
}