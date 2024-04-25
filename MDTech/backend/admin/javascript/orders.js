class OrderRenderer {
    constructor() {
        this.orderContainer = document.getElementById("orderContainer");
        this.updateInterval = 5000;
        this.fetchOrders();
        setInterval(() => this.fetchOrders(), this.updateInterval);
    }

    renderOrder(order) {
        const orderCard = document.createElement("div");
        orderCard.classList.add("order-card");

        const orderDetails = document.createElement("div");
        orderDetails.classList.add("order-details");
        orderDetails.innerHTML = `
            <span class="order-id">Order ID: ${order.order_id}</span>
            <span class="order-email">${order.email}</span>
            <span class="order-date">${order.date}</span>`;
        orderCard.appendChild(orderDetails);

        const orderCustomer = document.createElement("div");
        orderCustomer.classList.add("order-customer");
        orderCustomer.innerHTML = `<span class="customer-name">Customer: ${order.customer_name}</span>`;
        orderCard.appendChild(orderCustomer);

        const orderProducts = document.createElement("div");
        orderProducts.classList.add("order-products");

        
        for (let i = 0; i < order.product_id.length; i++) {
            const productId = order.product_id[i];
            const productName = order.product_names[i];
            const productQuantity = order.quantity[i];

            const productItem = document.createElement("div");
            productItem.classList.add("product-item");
            productItem.innerHTML = `
                <span class="product-name">${productName}</span>
                <span class="product-quantity">x${productQuantity}</span>
            `;
            orderProducts.appendChild(productItem);
        }
        orderCard.appendChild(orderProducts);

        const totalPrice = document.createElement("div");
        totalPrice.classList.add("total-price");
        totalPrice.innerText = `Total: ${parseFloat(order.price).toFixed(3)} Ft`;
        orderCard.appendChild(totalPrice);

        this.orderContainer.appendChild(orderCard);
    }

    fetchOrders() {
        this.orderContainer.innerHTML = '';
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                const orders = JSON.parse(xhr.responseText);
                orders.forEach(order => {
                    this.renderOrder(order);
                });
            }
        };
        xhr.open("GET", "../php/orders.php", true);
        xhr.send();
    }
}

const orderRenderer = new OrderRenderer();
