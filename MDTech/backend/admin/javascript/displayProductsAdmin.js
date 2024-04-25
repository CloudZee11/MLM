class Product {
    constructor(id, name, brand, consumption, type, price, color, description, features, shown, featured, image) {
        this.id = id;
        this.name = name;
        this.brand = brand;
        this.consumption = consumption;
        this.type = type;
        this.price = price;
        this.color = color;
        this.description = description;
        this.features = features.split(',');
        this.shown = shown;
        this.featured = featured;
        this.image = image;
    }

    createCardElement() {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-4';
        productCard.innerHTML = `
        <div class="product-card">
            <input type="hidden" class="product_id" value="${this.id}">
            <div class="d-flex justify-content-between">
                <p class="card-text" style="color: #0000FF">Látható: ${this.shown === 'on' ? 'Igen' : 'Nem'}</p>
                <p class="card-text" style="color: #0000FF">Kiemelt: ${this.featured === 'on' ? 'Igen' : 'Nem'}</p>
            </div>
            <hr>
            <img src="../../../frontend/${this.image}" alt="${this.name}" class="card-img-top-center mt-auto">
            <div class="card-body d-flex flex-column">
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
            </div>
            <br>
            <div class="d-flex justify-content-between">
                <button type="button" class="btn edit-btn btn-warning">Szerkesztés</button>
                <button type="button" class="btn btn-success">Done!</button>
                <button type="button" class="btn remove-btn btn-danger">Eltávolítás</button>
            </div>
        </div>
        `;




        const moreBtn = productCard.querySelector('.more-btn');
        const moreInfo = productCard.querySelector('.more-info');
        const editBtn = productCard.querySelector('.edit-btn');
        const removeBtn = productCard.querySelector('.remove-btn');
        removeBtn.dataset.productId = this.id;
        const successBtn = productCard.querySelector('.btn-success');

        moreBtn.addEventListener('click', () => {
            if (moreInfo.style.display === 'none' || moreInfo.style.display === '') {
                moreInfo.style.display = 'block';
                moreBtn.textContent = 'Kevesebb...';
            } else {
                moreInfo.style.display = 'none';
                moreBtn.textContent = 'Több...';
            }
        });

        editBtn.addEventListener('click', () => {

            console.log('Szerkesztés gombra kattintva');
        });

        successBtn.addEventListener('click', () => {


            const modal = document.getElementById("myModal");

            
            const span = document.getElementsByClassName("close")[0];

            
            const highlightBtn = document.getElementById("highlightBtn");
            const doneBtn = document.getElementById("doneBtn");
            const cancelBtn = document.getElementById("cancelBtn");

           
            successBtn.addEventListener('click', () => {
                modal.style.display = "block";
            });

            
            span.addEventListener('click', () => {
                modal.style.display = "none";
            });

            
            window.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            });

            
            highlightBtn.addEventListener('click', () => {
                window.alert("Kiemelés");
                console.log('Termék kiemelve');
                modal.style.display = "none";
            });

            doneBtn.addEventListener('click', () => {
                window.alert("Done!");
                console.log('Termék feltöltve');
                modal.style.display = "none";
            });

            cancelBtn.addEventListener('click', () => {
                window.alert("MÉGSE");
                console.log('MÉGSE');
                modal.style.display = "none";

            });



        });


        removeBtn.addEventListener('click', async (event) => {
            try {
                const product_id = event.target.dataset.productId;
                console.log('Eltávolításra kiválasztott termék azonosítója:', product_id);

                const response = await fetch('../php/remove_product.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(parseInt(product_id)),
                });

                if (!response.ok) {
                    throw new Error('Hiba a kérésben.');
                }

                const data = await response.json();

                if (data.success) {
                    console.log('Termék sikeresen eltávolítva.');
                    event.target.closest('.product-card').remove();
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                console.error('Hiba a kommunikáció során:', error.message);
            }
        });


        return productCard;
    }

}

document.addEventListener('DOMContentLoaded', function () {
    fetch('../php/get_products_admin.php?type=airconditioners')
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
                    productData.shown,
                    productData.featured,
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
