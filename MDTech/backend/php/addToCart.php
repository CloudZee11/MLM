<?php
class Database
{
    private $servername = "localhost";
    private $username = "root";
    private $password = "";
    private $dbname = "mdtech";
    private $connection;

    
    public function __construct()
    {
        $this->connection = new mysqli($this->servername, $this->username, $this->password, $this->dbname);

        if ($this->connection->connect_error) {
            die("Sikertelen kapcsolódás az adatbázishoz: " . $this->connection->connect_error);
        }
    }

   
    public function addToCart($productId, $userId)
    {
       
        $query = "SELECT `user_id` FROM `user_cart_relationship` WHERE `user_id` = $userId";
        $result = mysqli_query($this->connection, $query);

        if (!$result || mysqli_num_rows($result) == 0) {
           
            $query = "INSERT INTO `user_cart_relationship` (`user_id`) VALUES ($userId)";
            $result = mysqli_query($this->connection, $query);

            if (!$result) {
                echo'<span class="error-message"> Hiba történt! ' . mysqli_error($this->connection) . '</span>';
                return;
            }
        }

        
        $query = "SELECT `user_id` FROM `user_cart_relationship` WHERE `user_id` = $userId";
        $result = mysqli_query($this->connection, $query);
        $row = mysqli_fetch_assoc($result);
        $cartId = $row['user_id'];

       
        $query = "SELECT * FROM `cart-items` WHERE `cart_id` = $cartId AND `product_id` = $productId";
        $result = mysqli_query($this->connection, $query);

        if (mysqli_num_rows($result) > 0) {
            
            $query = "UPDATE `cart-items` SET `quantity` = `quantity` + 1 WHERE `cart_id` = $cartId AND `product_id` = $productId";
            $result = mysqli_query($this->connection, $query);
            if ($result) {
                echo '<span class="success-message"> A termék sikeresen hozzáadva a kosárhoz! </span>';
            } else {
                echo '<span class="error-message"> Hiba történt! Kérlek próbáld újra! ' . mysqli_error($this->connection) . '</span>';
            }
        } else {
           
            $query = "INSERT INTO `cart-items` (`cart_id`, `product_id`, `quantity`) VALUES ($cartId, $productId, 1)";
            $result = mysqli_query($this->connection, $query);

            if ($result) {
                echo '<span class="success-message"> A termék sikeresen hozzáadva a kosárhoz! </span>';
            } else {
                echo '<span class="error-message"> Hiba történt! ' . mysqli_error($this->connection) . '</span>';
            }
        }

    }

    public function closeConnection()
    {
        mysqli_close($this->connection);
    }
}

session_start();

if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_email'])) {
    echo '<span class="error-message"> Kosárba helyezéshez be kell jelentkezned! </span>';
    exit();
}

if (!isset($_POST['productId'])) {
    echo '<span class="error-message"> Hibás kérés! </span>';
    exit();
}

$productId = $_POST['productId'];
$userId = $_SESSION['user_id'];

$database = new Database();
$database->addToCart($productId, $userId);
$database->closeConnection();
