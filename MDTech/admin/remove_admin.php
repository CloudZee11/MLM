<?php

class UserManager
{
    private $conn;

    public function __construct($hostName, $dbUser, $dbPassword, $dbName)
    {
        $this->conn = mysqli_connect($hostName, $dbUser, $dbPassword, $dbName);

        if (!$this->conn) {
            die("Connection failed: " . mysqli_connect_error());
        }
    }

    public function removeAdminRole($email)
    {
        // Ellenőrizze, hogy a felhasználó rendelkezik-e admin jogosultsággal
        $checkAdminQuery = "SELECT * FROM users WHERE email = '$email' AND role = 'admin'";
        $checkAdminResult = mysqli_query($this->conn, $checkAdminQuery);

        if (mysqli_num_rows($checkAdminResult) > 0) {
            // Az admin jog elvétele
            $removeAdminQuery = "UPDATE users SET role = 'user', admin_since = NULL, deleted_at = NOW() WHERE email = '$email'";
            if (mysqli_query($this->conn, $removeAdminQuery)) {
                return "Az admin jog sikeresen eltávolítva.";
            } else {
                return "Hiba az admin jog eltávolítása során: " . mysqli_error($this->conn);
            }
        } else {
            return "A felhasználó nem rendelkezik admin jogosultsággal.";
        }
    }

    public function closeConnection()
    {
        mysqli_close($this->conn);
    }
}

// Használat példa:
$hostName = "localhost";
$dbUser = "root";
$dbPassword = "";
$dbName = "mdtech";

$userManager = new UserManager($hostName, $dbUser, $dbPassword, $dbName);

if (isset($_POST['email'])) {
    $email = $_POST['email'];
    $result = $userManager->removeAdminRole($email);
    echo $result;
} else {
    echo "Hiányzó email cím.";
}

$userManager->closeConnection();
