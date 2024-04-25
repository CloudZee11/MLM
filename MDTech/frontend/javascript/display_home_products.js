class Product {
    constructor(id, name, brand, consumption, type, price, color, short_description, description, features, image) {
        this.id = id;
        this.name = name;
        this.brand = brand;
        this.consumption = consumption;
        this.type = type;
        this.price = price;
        this.color = color;
        this.short_description = short_description;
        this.description = description;
        this.features = features.split(',');
        this.image = image;
    }

    createCardElement() {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-4';
        productCard.innerHTML = `
            <div class="product-card-home">
                <img src="../${this.image}" alt="${this.name}" class="card-img-top-center mt-auto">
                <div class="card-body d-flex flex-column justify-content-between">
                    <br>
                    <h3 class="card-title">${this.name}</h3>
                    <!-- <p class="card-text">Márka: ${this.brand}</p> -->
                    <p class="card-text">Típus: ${this.type}</p>
                    <p class="card-text">Szín: ${this.color}</p>
                    <!-- <p class="card-text">Röviden: ${this.short_description}</p> -->
                    <p class="card-text">Fogyasztás: ${this.consumption}</p>
                    <ul class="features-list"> 
                        ${this.features.map(feature => `<li>${feature.trim()}</li>`).join('')}
                    </ul> 
                    <p class="card-text"><b>Ár: ${parseFloat(this.price).toFixed(3)} Ft</b></p>
                    <br>
                    <a href="shop.html" class="btn btncart btn-outline-primary mt-auto">Részletek Megtekintése</a>
                </div>
            </div>
        `;
        return productCard;
    }
}

document.addEventListener('DOMContentLoaded', function () {
   
    fetch('../../backend/php/get_home_products.php?type=airconditioners')
        .then(response => response.json())
        .then(airConditioners => {
            const productContainer = document.getElementById('productContainer');

            
            airConditioners.forEach((productData, index) => {
                const product = new Product(
                    productData.id,
                    productData.name,
                    productData.brand,
                    productData.consumption,
                    productData.type,
                    productData.price,
                    productData.color,
                    productData.short_description,
                    productData.description,
                    productData.features,
                    productData.image
                );

                const productCard = product.createCardElement();

                
                if ((index + 1) % 3 === 1) {
                    
                    const rowContainer = document.createElement('div');
                    rowContainer.classList.add('row', 'justify-content-center', 'mb-3');

                    document.getElementById('productContainer').appendChild(rowContainer);
                }

                document.getElementById('productContainer').lastChild.appendChild(productCard);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});
