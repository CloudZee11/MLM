document.addEventListener("DOMContentLoaded", function() {
   
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var orders = JSON.parse(this.responseText);
            displayOrders(orders);
        }
    };
    xhttp.open("GET", "../php/active_orders.php", true);
    xhttp.send();
});

function displayOrders(orders) {
    var activeOrdersDiv = document.getElementById("activeOrders");
    
    var ordersHTML = "";
    orders.forEach(function(order, index) {
        ordersHTML += '<div class="order">';
        ordersHTML += '<p>Dátum: ' + order.date + '</p>';
        ordersHTML += '<p>Order ID: ' + order.order_id + '</p>';
        ordersHTML += '<p>Név: ' + order.full_name + '</p>';
        ordersHTML += '<hr style="color: white;">';
    });
    activeOrdersDiv.innerHTML = ordersHTML;
}


