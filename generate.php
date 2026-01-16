<?php
// Tambahkan header untuk CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database prompt kategori
$promptCategories = [
    'programming' => [
        "Buatkan kode Python untuk web scraping dengan BeautifulSoup",
        "Bantu saya debug error dalam kode JavaScript",
        "Jelaskan perbedaan antara API REST dan GraphQL",
        "Buatkan skrip untuk otomasi backup database",
        "Ajarkan cara menggunakan Git untuk kolaborasi tim"
    ],
    'writing' => [
        "Bantu saya menulis email profesional untuk klien",
        "Buatkan outline untuk artikel blog tentang teknologi AI",
        "Perbaiki tata bahasa dalam dokumen proposal bisnis",
        "Buatkan caption menarik untuk postingan Instagram",
        "Tuliskan script untuk video penjelasan produk"
    ],
    'design' => [
        "Buatkan wireframe untuk aplikasi mobile e-commerce",
        "Berikan rekomendasi palet warna untuk brand teknologi",
        "Jelaskan prinsip-prinsip desain UI/UX yang baik",
        "Bantu saya memilih font yang cocok untuk website",
        "Buatkan mockup untuk halaman landing page"
    ],
    'education' => [
        "Jelaskan konsep machine learning untuk pemula",
        "Buatkan rangkuman tentang sejarah internet",
        "Berikan contoh implementasi blockchain",
        "Jelaskan cara kerja neural network dengan sederhana",
        "Buatkan quiz tentang programming fundamentals"
    ],
    'business' => [
        "Bantu saya membuat business plan untuk startup",
        "Buatkan strategi pemasaran digital untuk produk baru",
        "Analisis SWOT untuk bisnis e-commerce",
        "Buatkan proposal partnership untuk investor",
        "Rekomendasikan tools untuk produktivitas tim"
    ]
];

// Ambil kategori dari request (jika ada)
$category = isset($_GET['category']) ? $_GET['category'] : 'all';

if ($category === 'all') {
    // Gabungkan semua prompt
    $allPrompts = [];
    foreach ($promptCategories as $catPrompts) {
        $allPrompts = array_merge($allPrompts, $catPrompts);
    }
    $prompts = $allPrompts;
} elseif (isset($promptCategories[$category])) {
    $prompts = $promptCategories[$category];
} else {
    $prompts = $promptCategories['programming'];
}

// Pilih prompt secara acak
$randomIndex = array_rand($prompts);
$selectedPrompt = $prompts[$randomIndex];

// Kembalikan response
echo json_encode([
    'success' => true,
    'data' => [
        'prompt' => $selectedPrompt,
        'category' => $category === 'all' ? 'campuran' : $category,
        'language' => 'Indonesia',
        'generated_at' => date('Y-m-d H:i:s')
    ]
]);
?>