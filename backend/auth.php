<?php
// backend/auth.php

// CONFIGURACIÓN DE TU SERVIDOR (¡CAMBIA ESTO!)
$servidor = "localhost";      // En el 99% de hostings se deja "localhost"
$usuario  = "root";   // El usuario de la base de datos que creaste en el hosting
$password = "1213";// La contraseña de ese usuario
$base_datos = "feria_empleo_irun";    // El nombre de tu base de datos en el hosting

// Conexión
$conn = new mysqli($servidor, $usuario, $password, $base_datos);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión al servidor"]));
}

// Recibir datos JSON
$data = json_decode(file_get_contents("php://input"));
$accion = $data->action ?? '';
$user = $data->username ?? '';
$pass = $data->password ?? '';

header('Content-Type: application/json');

// LOGICA DE LOGIN
if ($accion === "login") {
    $stmt = $conn->prepare("SELECT password FROM usuarios WHERE username = ?");
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        // Compara contraseñas (Texto plano según pediste)
        if ($pass === $row['password']) {
            echo json_encode(["success" => true, "message" => "Login correcto"]);
        } else {
            echo json_encode(["success" => false, "message" => "Contraseña incorrecta"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
    }
} 
// LOGICA DE REGISTRO
elseif ($accion === "register") {
    // 1. Comprobar si ya existe
    $check = $conn->prepare("SELECT id FROM usuarios WHERE username = ?");
    $check->bind_param("s", $user);
    $check->execute();
    if ($check->get_result()->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "El usuario ya existe"]);
    } else {
        // 2. Crear usuario
        $stmt = $conn->prepare("INSERT INTO usuarios (username, password) VALUES (?, ?)");
        $stmt->bind_param("ss", $user, $pass);
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Usuario registrado"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al guardar en BD"]);
        }
    }
} else {
    echo json_encode(["success" => false, "message" => "Acción no válida"]);
}

$conn->close();
?>