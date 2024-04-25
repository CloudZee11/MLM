<?php

$servername = "localhost";
$username = "root"; 
$password = "";
$dbname = "mdtech";


$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Kapcsolódási hiba: " . $conn->connect_error);
}


$city = $_POST['city'];
$address = $_POST['address'];
$floor = $_POST['floor'];
$postal_code = $_POST['postal_code'];


session_start();
if (!isset($_SESSION['user_id'])) {
    die("Hiba: A felhasználói azonosító nem található a session-ben.");
}
$user_id = $_SESSION['user_id'];


$sql_user = "SELECT full_name FROM users WHERE id = ?";
$stmt_user = $conn->prepare($sql_user);
$stmt_user->bind_param("i", $user_id);
$stmt_user->execute();
$stmt_user->store_result();
$stmt_user->bind_result($recipient_name);
$stmt_user->fetch();


$sql = "INSERT INTO shipping_addresses (user_id, recipient_name, address, floor, city, postal_code) VALUES (?, ?, ?, ?, ?, ?)";


$stmt = $conn->prepare($sql);


if ($stmt) {
    
    $stmt->bind_param("isssss", $user_id, $recipient_name, $address, $floor, $city, $postal_code);

    
    if ($stmt->execute()) {
        echo "Szállítási adatok sikeresen felvéve.";
    } else {
        echo "Hiba történt a szállítási adatok felvétele során: " . $conn->error;
    }

   
    $stmt->close();
} else {
    echo "Hiba történt a prepared statement létrehozásakor: " . $conn->error;
}


$conn->close();

