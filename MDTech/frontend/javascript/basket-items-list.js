class BasketUpdater {
    constructor(url) {
        this.url = url;
        this.basketItemsList = document.getElementById("basket-items");
        this.basketItemsList2 = document.getElementById("basket-items2");
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
                this.basketItemsList2.innerHTML = "";

                if (basketItems.length === 0) {
                    var emptyMessage = document.createElement("p");
                    emptyMessage.textContent = "A kosár jelenleg üres";
                    this.basketItemsList.appendChild(emptyMessage);
                    this.basketItemsList2.appendChild(emptyMessage.cloneNode(true));
                    document.getElementById("total-price").textContent = "0 Ft";
                    document.getElementById("total-price2").textContent = "0 Ft";
                    this.checkoutContainer.style.display = "none";
                } else {
                    basketItems.forEach(function (item) {
                        var listItem = document.createElement("li");
                        listItem.textContent = item.name + " - " + item.quantity + " db";
                        this.basketItemsList.appendChild(listItem);
                        this.basketItemsList2.appendChild(listItem.cloneNode(true));
                        totalPrice += item.price * item.quantity;
                    }.bind(this));

                    document.getElementById("total-price").textContent = " " + totalPrice.toLocaleString('hu-HU', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).replace(',', ' ') + " Ft";
                    document.getElementById("total-price2").textContent = " " + totalPrice.toLocaleString('hu-HU', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).replace(',', ' ') + " Ft";

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

    clearBasket() {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "../../backend/php/clear_basket.php", true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                this.updateBasketItems();
                this.updateCartCounter();
            }
        }.bind(this);

        xhr.send();
    }
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

    var clearBasketButton = document.getElementById("torles");
    clearBasketButton.addEventListener("click", function () {
        basketUpdater.clearBasket();
    });

    var finishOrderButton = document.getElementById("finish");
    finishOrderButton.addEventListener("click", function () {
        
        var selectedAddressIndicator = document.querySelector(".select-indicator.selected");
        if (selectedAddressIndicator) {
            var selectedAddressId = selectedAddressIndicator.dataset.addressId;

            
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "../../backend/php/get_basket_items.php", true);
            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.onload = () => {
                if (xhr.status === 200) {
                    var basketItems = JSON.parse(xhr.responseText);
                   
                    submitOrder(selectedAddressId, JSON.stringify(basketItems));
                } else {
                    console.error("Hiba történt a kosár tartalmának lekérése közben.");
                }
            };

            xhr.send();
        } else {
            alert("Kérlek, válassz ki egy lakcímet a rendelés leadása előtt!");
        }
    });

    function submitOrder(addressId, otherData) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "../../backend/php/finish_order.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        
        xhr.onload = () => {
            if (xhr.status === 200) {
                console.log("Rendelés sikeresen leadva!");
                
                basketUpdater.clearBasket();

                showNotification('A rendelés sikeresen leadva!');
                
            }
        };
    
        xhr.send(`addressId=${addressId}&otherData=${otherData}`);
    }

    function showNotification(message) {
        var notification = document.querySelector('.Notification');
        notification.textContent = message;
        notification.style.display = 'block';
    
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

});
