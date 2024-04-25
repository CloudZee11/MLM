<?php
class FinancialDataFetcher {
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

    
    public function getTotalGrossIncome() {
        $sql = "SELECT SUM(price) AS totalGrossIncome FROM orders";
        $result = $this->conn->query($sql);

        $totalGrossIncome = 0;
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $totalGrossIncome = $row["totalGrossIncome"];
        }

        return $totalGrossIncome;
    }

    
    public function closeConnection() {
        $this->conn->close();
    }
}


$financialDataFetcher = new FinancialDataFetcher();
$totalGrossIncome = $financialDataFetcher->getTotalGrossIncome();
$financialDataFetcher->closeConnection();


echo json_encode($totalGrossIncome);
