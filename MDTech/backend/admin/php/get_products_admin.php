<?php

class ProductFetcher
{
    private $pdo;

    public function __construct($host, $dbname, $username, $password)
    {
        $dsn = "mysql:host=$host;dbname=$dbname";
        $this->pdo = new PDO($dsn, $username, $password);
    }

    public function getAirConditioners()
    {
        $query = "SELECT * FROM airconditioners";
        $statement = $this->pdo->query($query);

        if ($statement) {
            $airConditioners = $statement->fetchAll(PDO::FETCH_ASSOC);
            return json_encode($airConditioners);
        } else {
            return json_encode(['error' => 'Error fetching air conditioners']);
        }
    }
}


$hostName = "localhost";
$dbUser = "root";
$dbPassword = "";
$dbName = "mdtech";


$productFetcher = new ProductFetcher($hostName, $dbName, $dbUser, $dbPassword);
echo $productFetcher->getAirConditioners();
