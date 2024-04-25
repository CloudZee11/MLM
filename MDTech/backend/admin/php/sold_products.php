<?php
class Database {
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

    
    public function getTotalSoldProducts() {
        $sql = "SELECT product_id, quantity FROM orders";
        $result = $this->conn->query($sql);

        $totalSold = 0;

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $quantities = explode(",", $row["quantity"]);

                foreach ($quantities as $quantity) {
                    $totalSold += intval($quantity);
                }
            }
        }

        return $totalSold;
    }
    
    public function closeConnection() {
        $this->conn->close();
    }
}

$database = new Database();
$totalSold = $database->getTotalSoldProducts();
echo $totalSold;
$database->closeConnection();
