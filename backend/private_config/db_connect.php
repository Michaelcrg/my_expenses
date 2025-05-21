<?php

require_once __DIR__ . '/../api/loadenv.php';

loadEnv();

class Database
{
    private static $instance;

    public static function get()
    {
        if (!self::$instance) {
            $host = $_ENV['DB_HOST'] ?? 'localhost';
            $user = $_ENV['DB_USER'] ?? 'root';
            $pass = $_ENV['DB_PASS'] ?? '';
            $db   = $_ENV['DB_NAME'] ?? '';

            self::$instance = new mysqli($host, $user, $pass, $db);

            if (self::$instance->connect_error) {
                error_log("ERRORE DB: " . self::$instance->connect_error);
                throw new Exception("Connessione fallita");
            }

            self::$instance->set_charset("utf8mb4");
        }

        return self::$instance;
    }
}
