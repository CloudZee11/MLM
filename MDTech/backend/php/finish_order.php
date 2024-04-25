<?php
header('Content-Type: text/html; charset=utf-8');

class OrderProcessor
{
    private $conn;
    private $userId;

    public function __construct($conn, $userId)
    {
        $this->conn = $conn;
        $this->userId = $userId;
    }

    public function processOrder($addressId, $otherData)
    {
        $basketItems = json_decode($otherData, true);

        
        if (!empty($basketItems)) {
            
            $totalPrice = 0;
            $productIds = array();
            $quantities = array();

            
            foreach ($basketItems as $item) {
                $productId = $item['product_id'];
                $quantity = $item['quantity'];
                $price = $item['price'];

                
                $productIds[] = $productId;
                $quantities[] = $quantity;

               
                $totalPrice += $price * $quantity;
            }

            
            $productIdString = implode(',', $productIds);
            $quantityString = implode(',', $quantities);

            
            $randomOrderId = '#' . mt_rand(100000, 999999);

            $insertQuery = "INSERT INTO orders (order_id, product_id, quantity, price, user_id, address_id) 
                            VALUES ('$randomOrderId', '$productIdString', '$quantityString', '$totalPrice', '$this->userId', '$addressId')";

            $result = mysqli_query($this->conn, $insertQuery);

            if (!$result) {
                echo "Hiba történt a rendelés mentése közben.";
                exit;
            } else {
                echo "A rendelés sikeresen feldolgozva!";
            }
        } else {
            echo "A kosár üres.";
        }
    }


}


$hostName = "localhost";
$dbUser = "root";
$dbPassword = "";
$dbName = "mdtech";

$conn = mysqli_connect($hostName, $dbUser, $dbPassword, $dbName);

if (!$conn) {
    die("Nem sikerült kapcsolódni az adatbázishoz. Kérlek, próbáld újra később.");
}


session_start();
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_email'])) {
    echo "Nincs bejelentkezve felhasználó.";
    exit();
}

$userId = $_SESSION['user_id'];


if (isset($_POST['addressId']) && isset($_POST['otherData'])) {
    $addressId = $_POST['addressId'];
    $otherData = $_POST['otherData'];

    
    $orderProcessor = new OrderProcessor($conn, $userId);
    $orderProcessor->processOrder($addressId, $otherData);
} else {
    echo "Nem érkezett megfelelő adat a rendelés feldolgozásához.";
}
