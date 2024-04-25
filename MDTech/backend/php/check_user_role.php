<?php
session_start();
require_once 'database.php';

class UserRoleChecker
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    public function checkUserRole()
    {
        try {
            if (isset($_SESSION["user_id"]) && isset($_SESSION["user_email"])) {
                $userId = $_SESSION["user_id"];
                $userEmail = $_SESSION["user_email"];
                $isAdmin = $this->checkAdminRole($userId, $userEmail);
                return $isAdmin ? "admin" : "user";
            }
        } catch (Exception $e) {
            error_log('Hiba a felhasználó szerepének ellenőrzése közben: ' . $e->getMessage());
            
            return "error";
        }

        return "guest"; 
    }

    private function checkAdminRole($userId, $userEmail)
    {
        
        $sql = "SELECT role FROM users WHERE id = ? AND email = ? AND role = 'admin'";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("is", $userId, $userEmail);
        $stmt->execute();
        $stmt->store_result();
        $isAdmin = $stmt->num_rows > 0;

        $stmt->close();

        return $isAdmin;
    }
}


$conn = new mysqli($hostName, $dbUser, $dbPassword, $dbName);


if ($conn->connect_error) {
    
    die(json_encode(array("userRole" => "error")));
}


$checker = new UserRoleChecker($conn);
$userRole = $checker->checkUserRole();






$conn->close();


echo json_encode(array("userRole" => $userRole));
