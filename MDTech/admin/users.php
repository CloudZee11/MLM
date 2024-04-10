<?php
class Users {
    private $db;

    public function __construct() {
        
        $hostName = "localhost";
        $dbUser = "root";
        $dbPassword = "";
        $dbName = "mdtech";

        $this->db = mysqli_connect($hostName, $dbUser, $dbPassword, $dbName);

        if (!$this->db) {
            die("Nem sikerült kapcsolódni az adatbázishoz. Kérlek, próbáld újra később.");
        }
    }

    public function getRegisteredUsersCount() {
        
        $query = "SELECT COUNT(*) AS user_count FROM users";
        
        
        $result = mysqli_query($this->db, $query);

        
        if ($result) {
            
            $row = mysqli_fetch_assoc($result);
            return $row['user_count'];
        } else {
            
            return 0;
        }
    }
}


$users = new Users();


if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    
    header('Content-Type: application/json');
    
    echo json_encode(['registeredUsersCount' => $users->getRegisteredUsersCount()]);
}
