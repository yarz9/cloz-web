<?php
/**
 * Cloz Optimizer — Leaderboard API Endpoint
 *
 * Returns the top benchmark scores from the MySQL leaderboard table as JSON.
 * Columns: discord_id, username, score, cpu_score, ram_score, disk_score, submitted_at
 *
 * Usage:
 *   GET /api/leaderboard.php           → Top 50 entries
 *   GET /api/leaderboard.php?limit=10  → Top 10 entries
 *
 * Response:
 *   { "ok": true, "leaderboard": [ ... ] }
 *
 * Deploy this on a PHP-capable server (not Railway static).
 * Update DB credentials below or use environment variables.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Only allow GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// ── Database Configuration ───────────────────────────────────────────────────
// Use environment variables if available, otherwise fall back to defaults.
$db_host = getenv('DB_HOST') ?: 'localhost';
$db_name = getenv('DB_NAME') ?: 'cloz_optimizer';
$db_user = getenv('DB_USER') ?: 'root';
$db_pass = getenv('DB_PASS') ?: '';
$db_port = getenv('DB_PORT') ?: '3306';

// ── Limit parameter ─────────────────────────────────────────────────────────
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
if ($limit < 1) $limit = 1;
if ($limit > 100) $limit = 100;

try {
    $dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";
    $pdo = new PDO($dsn, $db_user, $db_pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    $stmt = $pdo->prepare(
        'SELECT discord_id, username, score, cpu_score, ram_score, disk_score, submitted_at
         FROM leaderboard
         ORDER BY score DESC
         LIMIT :lim'
    );
    $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
    $stmt->execute();

    $rows = $stmt->fetchAll();

    // Add rank numbers
    $leaderboard = [];
    foreach ($rows as $i => $row) {
        $leaderboard[] = [
            'rank'         => $i + 1,
            'discord_id'   => $row['discord_id'],
            'username'     => $row['username'],
            'score'        => (int) $row['score'],
            'cpu_score'    => (int) $row['cpu_score'],
            'ram_score'    => (int) $row['ram_score'],
            'disk_score'   => (int) $row['disk_score'],
            'submitted_at' => $row['submitted_at'],
        ];
    }

    echo json_encode([
        'ok'          => true,
        'leaderboard' => $leaderboard,
        'count'       => count($leaderboard),
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'ok'    => false,
        'error' => 'Database connection failed',
    ]);
    // Log the actual error server-side (don't expose to client)
    error_log('Cloz Leaderboard API Error: ' . $e->getMessage());
}
