class BasketUpdater {
    constructor(url) {
        this.url = url;
        this.basketItemsList = document.getElementById("basket-items");
        this.cartCounter = document.querySelector(".cart-counter");
        this.checkoutContainer = document.getElementById("checkout");
    }

    addToBasket(productId) {
        var xhr = new XMLHttpRequest();
        var formData = new FormData();
        formData.append("product_id", productId);

        xhr.open("POST", this.url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                this.updateBasketItems();
                this.updateCartCounter();
            }
        }.bind(this);

        xhr.send(formData);
    }

    updateBasketItems() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var basketItems = JSON.parse(xhr.responseText);
                var totalPrice = 0;

                this.basketItemsList.innerHTML = "";

                if (basketItems.length === 0) {
                    var emptyMessage = document.createElement("p");
                    emptyMessage.textContent = "A kosár jelenleg üres";
                    this.basketItemsList.appendChild(emptyMessage);
                    document.getElementById("total-price").textContent = "0 Ft";
                    this.checkoutContainer.style.display = "none";
                } else {
                    basketItems.forEach(function (item) {
                        var listItem = document.createElement("li");
                        listItem.textContent = item.name + " - " + item.quantity + " db";
                        this.basketItemsList.appendChild(listItem);
                        totalPrice += item.price * item.quantity;
                    }.bind(this));

                    document.getElementById("total-price").textContent = " " + totalPrice.toLocaleString('hu-HU', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).replace(',', ' ') + " Ft";
                    this.updateCartCounter();
                    this.checkoutContainer.style.display = "block";
                       
                }    
            }
            
        }.bind(this);

        xhr.send();
    }

    updateCartCounter() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var basketItems = JSON.parse(xhr.responseText);
                if (basketItems.length > 0) {
                    var itemCount = basketItems.reduce((acc, item) => acc + parseInt(item.quantity), 0);
                    this.cartCounter.textContent = itemCount;
                    this.cartCounter.style.display = "";
                } else {
                    this.cartCounter.style.display = "none";
                }
            }
        }.bind(this);

        xhr.send();
    }
}


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


document.addEventListener("DOMContentLoaded", function () {
    var basketUpdater = new BasketUpdater("../../backend/php/get_basket_items.php");
    basketUpdater.updateBasketItems();

    var addToCartButtons = document.getElementsByClassName("add-to-cart-btn");
    Array.from(addToCartButtons).forEach(function (button) {
        button.addEventListener("click", function () {
            var productId = 123;
            basketUpdater.addToBasket(productId);
        });
    });
});
