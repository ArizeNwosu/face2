<?php
// Set CORS headers to allow requests from your frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate required fields
if (!$data || !isset($data['name']) || !isset($data['email'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: name and email']);
    exit();
}

// Sanitize input data
$name = htmlspecialchars(trim($data['name']));
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$phone = isset($data['phone']) ? htmlspecialchars(trim($data['phone'])) : '';
$company = isset($data['company']) ? htmlspecialchars(trim($data['company'])) : '';
$message = isset($data['message']) ? htmlspecialchars(trim($data['message'])) : '';

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit();
}

// Email configuration
$to = 'support@medspagen.com';
$subject = 'New Demo Request from MedSpaGen Website';

// Create email body
$emailBody = "New demo request received from the MedSpaGen website:\n\n";
$emailBody .= "Name: $name\n";
$emailBody .= "Email: $email\n";
$emailBody .= "Phone: " . ($phone ?: 'Not provided') . "\n";
$emailBody .= "Company: " . ($company ?: 'Not provided') . "\n\n";
$emailBody .= "Message:\n" . ($message ?: 'No message provided') . "\n\n";
$emailBody .= "---\n";
$emailBody .= "Submitted: " . date('Y-m-d H:i:s T') . "\n";
$emailBody .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";

// Email headers
$headers = [
    'From: MedSpaGen Website <noreply@medspagen.com>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8'
];

// Send email
try {
    $success = mail($to, $subject, $emailBody, implode("\r\n", $headers));
    
    if ($success) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Demo request submitted successfully'
        ]);
    } else {
        // Log error if needed
        error_log("Failed to send demo request email for: $email");
        
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to send email'
        ]);
    }
} catch (Exception $e) {
    error_log("Demo request email error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server error occurred'
    ]);
}
?>