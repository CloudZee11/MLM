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

    public function addAdminRole($adminEmail)
    {
        // Ellenőrzés: van-e megadva email cím
        if (empty($adminEmail)) {
            return json_encode(
                array(
                    'success' => false,
                    'message' => 'Az email címet meg kell adni.'
                )
            );
        }

        // Ellenőrzés: ha a user admin jogot kap, akkor a 'deleted_at' értékét NULL-ra állítjuk
        $sqlUpdateRole = "UPDATE users SET role='admin', admin_since=NOW(), deleted_at=NULL WHERE email='$adminEmail'";

        if (mysqli_query($this->conn, $sqlUpdateRole)) {
            return json_encode(
                array(
                    'success' => true,
                    'message' => 'Admin jog hozzáadva.'
                )
            );
        } else {
            return json_encode(
                array(
                    'success' => false,
                    'message' => 'Hiba történt az admin jog hozzáadása során: ' . mysqli_error($this->conn)
                )
            );
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

$adminEmail = isset($_POST['userEmail']) ? $_POST['userEmail'] : '';
$result = $userManager->addAdminRole($adminEmail);

echo $result;

$userManager->closeConnection();
