<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mdtech";

$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$sql = "SELECT orders.date, orders.order_id, users.full_name
        FROM orders
        INNER JOIN users ON orders.user_id = users.id";

$result = $conn->query($sql);


$rows = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
}
echo json_encode($rows);


$conn->close();
