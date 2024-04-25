class Product {
    constructor(id, name, brand, consumption, type, price, color, description, features, image) {
        this.id = id;
        this.name = name;
        this.brand = brand;
        this.consumption = consumption;
        this.type = type;
        this.price = price;
        this.color = color;
        this.description = description;
        this.features = features.split(',');
        this.image = image;
    }

    createCardElement() {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-4';
        productCard.innerHTML = `
        <div class="product-card">
            <img src="../${this.image}" alt="${this.name}" class="card-img-top-center">
            <div class="card-body d-flex flex-column ">
                <br>
                <h5 class="card-title">${this.name}</h5>
                <p class="card-text">Típus: ${this.type}</p>
                <p class="card-text">Szín: ${this.color}</p>
                <ul class="features-list"> 
                    ${this.features.map(feature => `<li>${feature.trim()}</li>`).join('')} 
                </ul> 
                <div class="more-info" style="display:none;">
                    <p class="card-text">Márka: ${this.brand}</p>
                    <p class="card-text">Fogyasztás: ${this.consumption}</p>
                    <br>
                    <p class="card-text">${this.description}</p>
                </div>
                <button class="more-btn">Több...</button>
                <p class="card-text"><b>Ár: ${parseFloat(this.price).toFixed(3)} Ft</b></p>
                <a class="btn btncart btn-outline-primary mt-auto add-to-cart-btn" href="##" onclick="addToCart(${this.id})">KOSÁRBA</a>
            </div>
        </div>
        `;

        const moreBtn = productCard.querySelector('.more-btn');
        const moreInfo = productCard.querySelector('.more-info');

        moreBtn.addEventListener('click', () => {
            if (moreInfo.style.display === 'none' || moreInfo.style.display === '') {
                moreInfo.style.display = 'block';
                moreBtn.textContent = 'Kevesebb...';
            } else {
                moreInfo.style.display = 'none';
                moreBtn.textContent = 'Több...';
            }
        });

        return productCard;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('../../backend/php/get_products.php?type=airconditioners')
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
                    productData.description,
                    productData.features,
                    productData.image
                );

                const productCard = product.createCardElement();

                if ((index + 1) % 3 === 1) {
                    const rowContainer = document.createElement('div');
                    rowContainer.classList.add('row', 'justify-content-center', 'mb-3');
                    productContainer.appendChild(rowContainer);
                }

                productContainer.lastChild.appendChild(productCard);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});
