function addToCart(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../addToCart.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
        }
    };
    xhr.send("productId=" + id);
}
