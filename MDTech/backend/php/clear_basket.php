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

    public function clearBasket($userId)
    {
        $query = "DELETE FROM `cart-items` WHERE `cart_id` IN (SELECT `user_id` FROM `user_cart_relationship` WHERE `user_id` = $userId)";
        $result = mysqli_query($this->connection, $query);

        if (!$result) {
            echo '<span class="error-message"> Hiba történt a kosár törlésekor! ' . mysqli_error($this->connection) . '</span>';
        } else {
            echo '<span class="success-message"> A kosár sikeresen törölve! </span>';
        }
    }

    public function closeConnection()
    {
        mysqli_close($this->connection);
    }
}

session_start();

if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_email'])) {
    echo '<span class="error-message"> Kosár törléséhez be kell jelentkezned! </span>';
    exit();
}

$userId = $_SESSION['user_id'];

$database = new Database();
$database->clearBasket($userId);
$database->closeConnection();
