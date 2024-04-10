<?php
require_once 'database.php';

session_start();
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_email'])) {
    echo "Kosárba helyezéshez be kell jelentkezned!";
    exit();
}

if (!isset($_POST['productId'])) { // Módosítottuk az id-t productId-re
    echo "Hibás kérés!";
    exit();
}

$productId = $_POST['productId'];

$userId = $_SESSION['user_id'];
$userEmail = $_SESSION['user_email'];

$query = "INSERT INTO `cart-items` (`cart_id`, `product_id`, `quantity`) 
          VALUES ((SELECT `cart_id` FROM `user_cart_relationship` WHERE `user_id` = $userId), $productId, 1)";

$result = mysqli_query($conn, $query);

if ($result) {
    echo "A termék sikeresen hozzá lett adva a kosárhoz!";
} else {
    echo "Hiba történt a kosárba helyezés során!";
}

mysqli_close($conn);
