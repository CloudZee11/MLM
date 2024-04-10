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
            // Hibakezelés: ha valami hiba történik, visszatérünk egy hibaüzenettel
            return "error";
        }

        return "guest"; // Guest if not logged in
    }

    private function checkAdminRole($userId, $userEmail)
    {
        // Prepare SQL query to check if user has admin role
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

// Create database connection
$conn = new mysqli($hostName, $dbUser, $dbPassword, $dbName);

// Check connection
if ($conn->connect_error) {
    // Hibakezelés: ha nincs kapcsolat az adatbázissal, visszatérünk egy hibaüzenettel
    die(json_encode(array("userRole" => "error")));
}

// Create instance of UserRoleChecker and check user role
$checker = new UserRoleChecker($conn);
$userRole = $checker->checkUserRole();





// Close connection
$conn->close();

// Echo the user role for usage in the application
echo json_encode(array("userRole" => $userRole));
