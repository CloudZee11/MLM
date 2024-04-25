<?php
session_start();

class LoginStatusChecker
{
    private $isLoggedIn;

    public function __construct()
    {
        $this->isLoggedIn = isset($_SESSION["user_id"]) && isset($_SESSION["user_email"]);
    }

    public function checkLoginStatus()
    {
        try {
            echo json_encode(["isLoggedIn" => $this->isLoggedIn]);
        } catch (Exception $e) {
            
            error_log('Hiba a bejelentkezési állapot ellenőrzése közben: ' . $e->getMessage());
            echo json_encode(["error" => "Hiba a bejelentkezési állapot ellenőrzése közben"]);
        }
    }
}


$checker = new LoginStatusChecker();
$checker->checkLoginStatus();
