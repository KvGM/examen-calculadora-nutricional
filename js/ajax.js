export async function getProducts(url) {
    //return (await fetch(url)).json();
    let options = {
        method: "GET"
    };
    return await fetch(url, options)
        .then(response => response.text())
        .then(data => {
            return JSON.parse(data);
        })
        .catch(error => {
            console.log(error);
        })
}