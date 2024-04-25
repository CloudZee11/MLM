class SoldProductsCounter {
    constructor() {
        this.updateInterval = 8000;
        this.updateSoldProductsCount();
        setInterval(() => this.updateSoldProductsCount(), this.updateInterval);
    }

    updateSoldProductsCount() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var totalSold = xhr.responseText;
                document.getElementById("soldProduct").innerText = totalSold;
            }
        };
        xhr.open("GET", "../php/sold_products.php", true);
        xhr.send();
    }
}

const soldProductsCounter = new SoldProductsCounter();
