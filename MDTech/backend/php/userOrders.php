<?php
session_start();


if (!isset($_SESSION['user_id'])) {
    die("Nincs bejelentkezve felhasználó!");
}


$servername = "localhost";
$username = "root"; 
$password = "";
$dbname = "mdtech";


$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$user_id = $_SESSION['user_id'];


$sql_user = "SELECT full_name FROM users WHERE id = $user_id";
$result_user = $conn->query($sql_user);
if ($result_user->num_rows > 0) {
    $row_user = $result_user->fetch_assoc();
    $full_name = $row_user["full_name"];
} else {
    die("Nem található felhasználó!");
}


$sql_orders = "SELECT o.order_id, o.quantity, o.price, o.date, ac.name, o.product_id
               FROM orders o 
               INNER JOIN airconditioners ac ON FIND_IN_SET(ac.id, o.product_id) > 0 
               WHERE o.user_id = $user_id";
$result_orders = $conn->query($sql_orders);
$orders = [];
if ($result_orders->num_rows > 0) {
    while($row = $result_orders->fetch_assoc()) {
        
        $product_ids = explode(",", $row["product_id"]);
        $quantities = explode(",", $row["quantity"]);
        $product_names = explode(",", $row["name"]);

       
        $minCount = min(count($product_ids), count($quantities), count($product_names));

       
        for ($i = 0; $i < $minCount; $i++) {
            $order = $row;
            $order["product_id"] = $product_ids[$i];
            $order["quantity"] = $quantities[$i];
            $order["name"] = $product_names[$i];
            $orders[] = $order;
        }
    }
}


$conn->close();


header('Content-Type: application/json');
echo json_encode($orders);
