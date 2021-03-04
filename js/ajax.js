export async function getProducts(url) {
    //Otra opción: return (await fetch(url)).json();
    let options = {
        method: "GET"
    };
    return await fetch(url, options)
        .then(response => response.text())
        .then(data => {
            return JSON.parse(data);
        })
        .catch(() => {
            return null;
        })
}
