<?php

class ProductFetcher
{
    private $pdo;

    public function __construct($host, $dbname, $username, $password)
    {
        $dsn = "mysql:host=$host;dbname=$dbname";
        $this->pdo = new PDO($dsn, $username, $password);
    }

    public function getFeaturedAirConditioners()
    {
        $query = "SELECT * FROM airconditioners WHERE featured = 'on'";
        $statement = $this->pdo->query($query);

        if ($statement) {
            $featuredAirConditioners = $statement->fetchAll(PDO::FETCH_ASSOC);
            return json_encode($featuredAirConditioners);
        } else {
            return json_encode(['error' => 'Error fetching featured airconditioners']);
        }
    }
}

$hostName = "localhost";
$dbUser = "root";
$dbPassword = "";
$dbName = "mdtech";

$productFetcher = new ProductFetcher($hostName, $dbName, $dbUser, $dbPassword);
echo $productFetcher->getFeaturedAirConditioners();
