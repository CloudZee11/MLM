<?php

$hostName = "localhost";
$dbUser = "root";
$dbPassword = "";
$dbName = "mdtech";

$conn = mysqli_connect($hostName, $dbUser, $dbPassword, $dbName);

if (!$conn) {
    die("Nem sikerült kapcsolódni az adatbázishoz. Kérlek, próbáld újra később.");
}

class Cart {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getCartItems($userId) {
        $query = "SELECT ci.product_id, ac.name, ac.price, ci.quantity 
                  FROM `cart-items` ci 
                  LEFT JOIN `airconditioners` ac ON ci.product_id = ac.id 
                  WHERE ci.cart_id = $userId";
    
        $result = mysqli_query($this->conn, $query);
    
        $cartItems = array();
    
        if ($result && mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                
                $cartItems[] = $row;
            }
        }
    
        return $cartItems;
    }
    
}


session_start();
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_email'])) {
    echo json_encode([]);
    exit();
}

$userId = $_SESSION['user_id'];


$cart = new Cart($conn);


$cartItems = $cart->getCartItems($userId);


echo json_encode($cartItems);
