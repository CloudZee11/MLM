var xhr = new XMLHttpRequest();
xhr.open("GET", "../../backend/php/userOrders.php", true);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var orders = JSON.parse(xhr.responseText);
        var tbody = document.querySelector("#orders-table tbody");
        var groupedOrders = {};

        
        orders.forEach(function (order) {
            if (!groupedOrders[order.order_id]) {
                groupedOrders[order.order_id] = {
                    order_id: order.order_id,
                    quantities: [],
                    productNames: [],
                    price: order.price,
                    date: order.date
                };
            }
            var quantities = order.quantity.split(","); 
            var productNames = order.name.split(",");

            
            groupedOrders[order.order_id].quantities.push.apply(groupedOrders[order.order_id].quantities, quantities);
            groupedOrders[order.order_id].productNames.push.apply(groupedOrders[order.order_id].productNames, productNames);
        });

        
        for (var orderId in groupedOrders) {
            var order = groupedOrders[orderId];
            var row = document.createElement("tr");
            var quantityText = "";
            for (var i = 0; i < order.quantities.length; i++) {
                quantityText += order.quantities[i] + " db " + order.productNames[i];
                if (i !== order.quantities.length - 1) {
                    quantityText += ", ";
                }
            }
            row.innerHTML = "<td>" + order.order_id + "</td>" +
                "<td>" + quantityText + "</td>" + 
                "<td>" + order.price + " Ft </td>" +
                "<td>" + order.date + "</td>";
            tbody.appendChild(row);
        }
    }
};
xhr.send();
