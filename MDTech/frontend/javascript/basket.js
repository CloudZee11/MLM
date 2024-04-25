function addToCart(productId) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../../backend/php/addToCart.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var notification = document.getElementById("notification");
            notification.innerHTML = xhr.responseText;
            notification.style.display = "block";

           
            var basketUpdater = new BasketUpdater("../../backend/php/get_basket_items.php");
            basketUpdater.updateBasketItems();
            basketUpdater.updateCartCounter();

            setTimeout(function() {
                notification.style.display = "none";
            }, 3000);
        }
    };

    xhr.send("productId=" + productId);
}

function clearBasket() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../../backend/php/clear_basket.php", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var notification = document.getElementById("notification");
            notification.innerHTML = xhr.responseText;
            notification.style.display = "block";
            var basketUpdater = new BasketUpdater("../../backend/php/get_basket_items.php");
            basketUpdater.updateBasketItems();
            basketUpdater.updateCartCounter();
        }
    };

    xhr.send();
}
