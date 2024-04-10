<?php

class Database
{
    private $hostName;
    private $dbUser;
    private $dbPassword;
    private $dbName;
    private $conn;

    public function __construct($hostName, $dbUser, $dbPassword, $dbName)
    {
        $this->hostName = $hostName;
        $this->dbUser = $dbUser;
        $this->dbPassword = $dbPassword;
        $this->dbName = $dbName;

        $this->connect();
    }

    private function connect()
    {
        $this->conn = new mysqli($this->hostName, $this->dbUser, $this->dbPassword, $this->dbName);

        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    public function query($sql)
    {
        return $this->conn->query($sql);
    }

    public function close()
    {
        $this->conn->close();
    }
}

class UserRepository
{
    private $db;

    public function __construct(Database $db)
    {
        $this->db = $db;
    }

    public function getActiveAdmins()
    {
        $sql = "SELECT * FROM users WHERE role = 'admin' AND deleted_at IS NULL";
        $result = $this->db->query($sql);

        $admins = array();

        while ($row = mysqli_fetch_assoc($result)) {
            $admins[] = array(
                'full_name' => $row['full_name'],
                'email' => $row['email'],
                'admin_since' => strtotime($row['admin_since']),
            );
        }

        return $admins;
    }

    public function getDeletedAdmins()
    {
        $sql = "SELECT * FROM users WHERE role = 'user' AND deleted_at IS NOT NULL";
        $result = $this->db->query($sql);

        $deletedAdmins = array();

        while ($row = mysqli_fetch_assoc($result)) {
            $deletedAdmins[] = array(
                'full_name' => $row['full_name'],
                'email' => $row['email'],
                'deleted_at' => strtotime($row['deleted_at']),
            );
        }

        return $deletedAdmins;
    }
}

// Példa használat
$hostName = "localhost";
$dbUser = "root";
$dbPassword = "";
$dbName = "mdtech";

// Példa használat
$db = new Database($hostName, $dbUser, $dbPassword, $dbName);
$userRepository = new UserRepository($db);

$admins = $userRepository->getActiveAdmins();
$deletedAdmins = $userRepository->getDeletedAdmins();

$db->close();

$response = array(
    'success' => true,
    'admins' => $admins,
    'deletedAdmins' => $deletedAdmins,
);

header('Content-Type: application/json');
echo json_encode($response);
