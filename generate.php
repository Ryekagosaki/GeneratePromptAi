<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Premium prompt database
$premiumPrompts = [
    'programming' => [
        "Buatkan kode Python lengkap untuk web scraping e-commerce dengan error handling dan rate limiting",
        "Implementasikan sistem autentikasi JWT dengan Node.js dan MongoDB yang aman dan scalable",
        "Buatkan RESTful API dengan Django untuk sistem manajemen inventaris bisnis",
        "Develop chatbot AI dengan Python dan NLTK untuk customer service otomatis",
        "Buatkan aplikasi React Native dengan TypeScript untuk tracking pengiriman barang"
    ],
    'writing' => [
        "Tulis artikel blog komprehensif tentang implementasi AI dalam industri kesehatan",
        "Buatkan proposal bisnis lengkap untuk startup fintech dengan analisis pasar dan proyeksi keuangan",
        "Susun laporan penelitian tentang dampak media sosial terhadap kesehatan mental remaja",
        "Tulis script video edukasi tentang machine learning untuk channel YouTube",
        "Buatkan konten marketing campaign untuk produk teknologi terbaru"
    ],
    'design' => [
        "Desain sistem design system untuk aplikasi enterprise dengan component library",
        "Buatkan user journey map untuk aplikasi banking mobile dengan persona yang berbeda",
        "Design wireframe dan prototype untuk platform e-learning dengan fitur gamification",
        "Buatkan style guide dan branding package untuk perusahaan teknologi",
        "Design dashboard analytics dengan data visualization yang interaktif"
    ],
    'ai' => [
        "Implementasikan model machine learning untuk prediksi harga saham dengan Python",
        "Buatkan sistem rekomendasi produk menggunakan collaborative filtering",
        "Develop image classification model untuk deteksi penyakit tanaman",
        "Implementasikan NLP untuk analisis sentimen review produk",
        "Buatkan chatbot dengan GPT integration untuk customer support"
    ],
    'business' => [
        "Susun business plan lengkap untuk platform SaaS dengan financial projection",
        "Buatkan strategi go-to-market untuk produk AI baru di Indonesia",
        "Analisis SWOT dan competitive analysis untuk startup e-commerce",
        "Buatkan pitch deck untuk investor dengan value proposition yang kuat",
        "Susun operational plan untuk scale-up perusahaan teknologi"
    ]
];

// Random category selection
$categories = array_keys($premiumPrompts);
$randomCategory = $categories[array_rand($categories)];

// Select random prompt from the category
$prompts = $premiumPrompts[$randomCategory];
$selectedPrompt = $prompts[array_rand($prompts)];

// Return premium response
echo json_encode([
    'success' => true,
    'data' => [
        'prompt' => $selectedPrompt,
        'category' => $randomCategory,
        'category_id' => 'premium',
        'difficulty' => 'advanced',
        'estimated_time' => '15-30 menit',
        'language' => 'Bahasa Indonesia',
        'generated_at' => date('Y-m-d H:i:s'),
        'version' => 'premium-2.0'
    ]
]);
?>
