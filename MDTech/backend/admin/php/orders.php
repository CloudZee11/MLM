<?php

class OrdersHandler {
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

    public function getOrders() {
        $sql = "SELECT o.*, u.full_name AS customer_name, u.email, GROUP_CONCAT(a.name) AS product_names
                FROM orders AS o 
                LEFT JOIN users AS u ON o.user_id = u.id
                LEFT JOIN airconditioners AS a ON FIND_IN_SET(a.id, o.product_id)
                GROUP BY o.id";
        $result = $this->conn->query($sql);
    
        $orders = array();
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                
                $row['quantity'] = explode(',', $row['quantity']);
                $row['product_id'] = explode(',', $row['product_id']);
                $row['product_names'] = explode(',', $row['product_names']);
                $orders[] = $row;
            }
        }
    
        return $orders;
    }
    

    public function closeConnection() {
        $this->conn->close();
    }
}


if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    $ordersHandler = new OrdersHandler();
    $orders = $ordersHandler->getOrders();
    $ordersHandler->closeConnection();

    header('Content-Type: application/json');
    echo json_encode($orders);
}
