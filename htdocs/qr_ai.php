<?php
require_once __DIR__ . '/vendor/autoload.php';

use BaconQrCode\Renderer\Image\Png;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = $_POST['message'] ?? 'Hello from RODA!';

    $renderer = new PngRenderer(
        new RendererStyle(400),
        new Png()
    );
    $writer = new Writer($renderer);
    $qrData = $writer->writeString($input);

    $reply = file_get_contents('http://localhost:8000/auto_reply?text=' . urlencode($input));

    header('Content-Type: text/html');
    echo "<h2>QR Code for: $input</h2>";
    echo "<img src='data:image/png;base64," . base64_encode($qrData) . "' />";
    echo "<h3>🧠 GPT-5 Says:</h3><p>$reply</p>";
    exit;
}
?>

<form method="POST">
    <input type="text" name="message" placeholder="Enter message or wallet" required>
    <button type="submit">Generate QR & Ask GPT</button>
</form>
