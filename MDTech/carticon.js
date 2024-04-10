let cartItemCount = 0;

function updateCartIcon() {
    const cartIcon = document.getElementById("cartIcon");
    const cartItemCountElement = document.getElementById("cartItemCount");
    cartItemCountElement.innerText = cartItemCount;
}

function addToCart(productName) {
    cartItemCount++;
    updateCartIcon();

    const cartDropdown = document.querySelector('.dropdown-menu');
    const newItem = document.createElement('li');
    newItem.innerHTML = `<a class="dropdown-item" href="#">${productName}</a>`;
    cartDropdown.appendChild(newItem);
}