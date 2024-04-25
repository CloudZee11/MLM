<?php
session_start();
class DatabaseManager {
    private $servername = "localhost";
    private $username = "root";
    private $password = "";
    private $dbname = "mdtech";
    private $conn;

    
    public function __construct() {
        $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    
    public function deleteShippingAddress($addressId) {
        $sql = "UPDATE shipping_addresses SET deleted = 'yes' WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $addressId);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo "Szállítási cím törölve!";
        } else {
            echo "Hiba történt: " . $stmt->error;
        }
        $stmt->close();
    }

    
    public function closeConnection() {
        $this->conn->close();
    }
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["addressId"])) {
    $addressId = $_POST["addressId"];

    $databaseManager = new DatabaseManager();
    $databaseManager->deleteShippingAddress($addressId);
    $databaseManager->closeConnection();
} else {
    echo "Hiba: Nem megfelelő kérés.";
}
