<?php
// AI Prompt Refiner Premium - Backend Processing
// Version 2.0 Premium with 50+ Animations

// Enable CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Security: Prevent direct access
if (!isset($_SERVER['HTTP_REFERER']) && !isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
    // Allow localhost for development
    if (!in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1'])) {
        echo json_encode([
            'success' => false,
            'error' => 'Access denied'
        ]);
        exit();
    }
}

// Set timezone
date_default_timezone_set('Asia/Jakarta');

// Add processing delay to simulate AI processing (adjustable)
$processingDelay = rand(800000, 2000000); // 0.8 - 2 seconds
usleep($processingDelay);

// ============================================
// PREMIUM TEXT IMPROVEMENT FUNCTIONS
// ============================================

/**
 * Improve Indonesian text by fixing common informal words
 */
function improveIndonesianText($text) {
    // Comprehensive dictionary of informal to formal Indonesian
    $improvements = [
        // Common informal words
        'bikinin' => 'buatkan',
        'bikin' => 'buat',
        'nggak' => 'tidak',
        'gak' => 'tidak',
        'gimana' => 'bagaimana',
        'gmn' => 'bagaimana',
        'aja' => 'saja',
        'deh' => '',
        'sih' => '',
        'dong' => '',
        'ya' => '',
        'nih' => '',
        'bgt' => 'sekali',
        'banget' => 'sekali',
        'kaya' => 'seperti',
        'kyk' => 'seperti',
        'kek' => 'seperti',
        'klo' => 'jika',
        'kalo' => 'jika',
        'klu' => 'jika',
        'klw' => 'jika',
        'yg' => 'yang',
        'trus' => 'kemudian',
        'udah' => 'sudah',
        'udh' => 'sudah',
        'sdh' => 'sudah',
        'blm' => 'belum',
        'blum' => 'belum',
        'tp' => 'tetapi',
        'tpi' => 'tetapi',
        'krn' => 'karena',
        'knp' => 'kenapa',
        'knpa' => 'kenapa',
        'mksd' => 'maksud',
        'brp' => 'berapa',
        'jg' => 'juga',
        'jga' => 'juga',
        'jgn' => 'jangan',
        'lg' => 'lagi',
        'lgi' => 'lagi',
        'mw' => 'ingin',
        'pgn' => 'ingin',
        'pls' => 'tolong',
        'please' => 'tolong',
        'thx' => 'terima kasih',
        'makasih' => 'terima kasih',
        'mksh' => 'terima kasih',
        'ty' => 'terima kasih',
        'ok' => 'baik',
        'oke' => 'baik',
        'okey' => 'baik',
        'ok deh' => 'baik',
        'sama' => 'dengan',
        'dgn' => 'dengan',
        'dengan' => 'dengan',
        'buat' => 'untuk',
        'utk' => 'untuk',
        'utuk' => 'untuk',
        'pd' => 'pada',
        'pda' => 'pada',
        'd' => 'di',
        'di' => 'di',
        'ke' => 'kepada',
        'kpd' => 'kepada',
        'kepada' => 'kepada',
        'dari' => 'dari',
        'dr' => 'dari',
        'dri' => 'dari',
        'buat' => 'untuk',
        
        // Programming/tech terms
        'coding' => 'pemrograman',
        'ngoding' => 'memprogram',
        'debug' => 'men-debug',
        'error' => 'kesalahan',
        'bug' => 'kutu program',
        'script' => 'skrip',
        'program' => 'program',
        'apps' => 'aplikasi',
        'app' => 'aplikasi',
        'web' => 'situs web',
        'website' => 'situs web',
        'online' => 'daring',
        'offline' => 'luring',
        'data' => 'data',
        'file' => 'berkas',
        'folder' => 'direktori',
        'download' => 'unduh',
        'upload' => 'unggah',
        'link' => 'tautan',
        'url' => 'alamat web',
        'api' => 'API',
        'database' => 'basis data',
        'server' => 'server',
        'client' => 'klien',
        'frontend' => 'front-end',
        'backend' => 'back-end',
        'framework' => 'kerangka kerja',
        'library' => 'pustaka',
        'package' => 'paket',
        'module' => 'modul',
        'function' => 'fungsi',
        'variable' => 'variabel',
        'array' => 'larik',
        'object' => 'objek',
        'class' => 'kelas',
        'method' => 'metode',
        'property' => 'properti',
        'interface' => 'antarmuka',
        
        // Business/formal terms
        'bisnis' => 'usaha',
        'usaha' => 'usaha',
        'perusahaan' => 'perusahaan',
        'company' => 'perusahaan',
        'startup' => 'perusahaan rintisan',
        'investor' => 'investor',
        'funding' => 'pendanaan',
        'profit' => 'keuntungan',
        'revenue' => 'pendapatan',
        'marketing' => 'pemasaran',
        'sales' => 'penjualan',
        'customer' => 'pelanggan',
        'client' => 'klien',
        'product' => 'produk',
        'service' => 'layanan',
        'team' => 'tim',
        'meeting' => 'rapat',
        'presentation' => 'presentasi',
        'report' => 'laporan',
        'analysis' => 'analisis',
        'strategy' => 'strategi',
        'plan' => 'rencana',
        'project' => 'proyek',
        'management' => 'manajemen',
        'leadership' => 'kepemimpinan',
        
        // Education/academic terms
        'belajar' => 'mempelajari',
        'ngajar' => 'mengajar',
        'materi' => 'materi',
        'pelajaran' => 'pelajaran',
        'education' => 'pendidikan',
        'training' => 'pelatihan',
        'course' => 'kursus',
        'tutorial' => 'tutorial',
        'guide' => 'panduan',
        'manual' => 'manual',
        'documentation' => 'dokumentasi',
        'research' => 'penelitian',
        'study' => 'studi',
        'thesis' => 'tesis',
        'dissertation' => 'disertasi',
        'paper' => 'makalah',
        'journal' => 'jurnal',
        'conference' => 'konferensi',
        'workshop' => 'lokakarya',
        'seminar' => 'seminar',
        'webinar' => 'webinar',
    ];
    
    // Split text into words while preserving punctuation
    $words = preg_split('/(\s+|[.,!?;:()"\'])/', $text, -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);
    $improvedWords = [];
    
    foreach ($words as $word) {
        $lowerWord = strtolower(trim($word));
        
        // Check if word is in improvements dictionary
        if (isset($improvements[$lowerWord])) {
            // Preserve original case pattern
            if (ctype_upper($word)) {
                $improvedWords[] = strtoupper($improvements[$lowerWord]);
            } elseif (ctype_lower($word)) {
                $improvedWords[] = $improvements[$lowerWord];
            } else {
                // Capitalize first letter if original word was capitalized
                $improvedWords[] = ucfirst($improvements[$lowerWord]);
            }
        } else {
            $improvedWords[] = $word;
        }
    }
    
    // Reconstruct the text
    $result = implode('', $improvedWords);
    
    // Capitalize first letter of the sentence
    $result = preg_replace_callback('/(^|[.!?]\s+)([a-z])/', function($matches) {
        return $matches[1] . strtoupper($matches[2]);
    }, ltrim($result));
    
    // Add period if no punctuation at the end
    if (!preg_match('/[.!?]$/', $result)) {
        $result .= '.';
    }
    
    // Fix multiple spaces
    $result = preg_replace('/\s+/', ' ', $result);
    
    // Fix space before punctuation
    $result = preg_replace('/\s+([.,!?;:])/', '$1', $result);
    
    return $result;
}

/**
 * Generate advanced prompt with 5 paragraphs (Premium Model)
 */
function generateAdvancedPrompt($text) {
    $improved = improveIndonesianText($text);
    
    // Detect the type of request for better contextual response
    $requestType = detectRequestType($text);
    $expertTitle = getExpertTitle($requestType);
    
    // Generate 5 comprehensive paragraphs
    $paragraphs = [
        // Paragraph 1: Introduction and context
        "Sebagai {$expertTitle}, saya akan membantu Anda dengan permintaan: \"{$improved}\". Berikut adalah analisis mendalam dan solusi komprehensif yang dirancang untuk memberikan hasil optimal dengan mempertimbangkan best practices dan standar industri terkini.",
        
        // Paragraph 2: Methodology and approach
        "Untuk mencapai tujuan tersebut, saya merekomendasikan pendekatan terstruktur yang terdiri dari beberapa tahapan kunci. Pertama, lakukan analisis kebutuhan yang mendalam untuk memahami scope dan constraints. Kedua, tentukan teknologi stack yang sesuai dengan mempertimbangkan scalability, maintainability, dan performance requirements.",
        
        // Paragraph 3: Implementation strategy
        "Dalam fase implementasi, penting untuk mengadopsi metodologi agile dengan siklus development iteratif. Mulailah dengan pembuatan prototype atau proof-of-concept untuk validasi konsep, kemudian kembangkan versi minimum viable product (MVP) dengan core features yang essential. Implementasikan testing secara komprehensif termasuk unit tests, integration tests, dan user acceptance testing.",
        
        // Paragraph 4: Best practices and optimization
        "Untuk memastikan kualitas kode dan maintainability, terapkan clean code principles, design patterns yang sesuai, dan comprehensive documentation. Optimalkan performance melalui code profiling, database indexing, caching strategy, dan load balancing. Implementasikan security best practices termasuk input validation, authentication, authorization, dan data encryption.",
        
        // Paragraph 5: Deployment and maintenance
        "Pada fase deployment, gunakan CI/CD pipeline untuk automated testing dan deployment. Monitor aplikasi secara real-time dengan logging, monitoring, dan alerting systems. Rencanakan maintenance schedule yang reguler termasuk updates, security patches, dan performance tuning. Terakhir, dokumentasikan seluruh proses dan hasil untuk knowledge sharing dan future reference."
    ];
    
    // Add specific recommendations based on request type
    $specificRecommendations = getSpecificRecommendations($requestType);
    if ($specificRecommendations) {
        $paragraphs[4] .= " " . $specificRecommendations;
    }
    
    return implode("\n\n", $paragraphs);
}

/**
 * Generate fast prompt with 2 paragraphs (Fast Model)
 */
function generateFastPrompt($text) {
    $improved = improveIndonesianText($text);
    
    // Generate 2 concise paragraphs
    $paragraphs = [
        // Paragraph 1: Direct solution
        "Untuk permintaan \"{$improved}\", berikut adalah solusi praktis yang dapat segera diimplementasikan. Pendekatan ini dirancang untuk memberikan hasil cepat dengan tetap memperhatikan quality standards.",
        
        // Paragraph 2: Implementation steps
        "Implementasikan solusi dengan mengikuti langkah-langkah berikut: (1) Siapkan environment dan dependencies, (2) Develop core functionality, (3) Lakukan testing dasar, (4) Deploy ke staging environment. Pastikan untuk menyesuaikan solusi dengan konteks spesifik Anda."
    ];
    
    return implode("\n\n", $paragraphs);
}

/**
 * Detect the type of request for better contextual responses
 */
function detectRequestType($text) {
    $text = strtolower($text);
    
    if (preg_match('/(kode|code|program|script|python|java|javascript|html|css|php|sql|coding|pemrograman)/', $text)) {
        return 'programming';
    } elseif (preg_match('/(tulis|tulisan|email|surat|artikel|blog|dokumen|proposal|laporan)/', $text)) {
        return 'writing';
    } elseif (preg_match('/(desain|design|ui|ux|wireframe|mockup|prototype)/', $text)) {
        return 'design';
    } elseif (preg_match('/(ai|machine learning|neural network|deep learning|chatbot|nlp)/', $text)) {
        return 'ai';
    } elseif (preg_match('/(bisnis|business|startup|investasi|marketing|sales|strategy)/', $text)) {
        return 'business';
    } elseif (preg_match('/(jelaskan|apa itu|bagaimana|cara|tutorial|panduan|penjelasan)/', $text)) {
        return 'education';
    } else {
        return 'general';
    }
}

/**
 * Get expert title based on request type
 */
function getExpertTitle($requestType) {
    $titles = [
        'programming' => 'Senior Software Engineer',
        'writing' => 'Professional Content Writer',
        'design' => 'Lead UI/UX Designer',
        'ai' => 'AI/ML Specialist',
        'business' => 'Business Consultant',
        'education' => 'Education Specialist',
        'general' => 'Professional Consultant'
    ];
    
    return $titles[$requestType] ?? 'Professional Consultant';
}

/**
 * Get specific recommendations based on request type
 */
function getSpecificRecommendations($requestType) {
    $recommendations = [
        'programming' => 'Pertimbangkan untuk menggunakan version control system seperti Git, implementasikan code review process, dan gunakan automated testing tools untuk menjaga code quality.',
        'writing' => 'Gunakan tools seperti Grammarly untuk grammar checking, lakukan plagiarism check, dan pastikan konten mengikuti SEO best practices untuk optimal online visibility.',
        'design' => 'Implementasikan design system untuk consistency, gunakan prototyping tools seperti Figma atau Adobe XD, dan lakukan user testing untuk usability validation.',
        'ai' => 'Pertimbangkan penggunaan pre-trained models untuk efficiency, implementasikan transfer learning jika applicable, dan gunakan cloud AI services untuk scalability.',
        'business' => 'Lakukan market research yang komprehensif, develop comprehensive business model canvas, dan pertimbangkan funding options seperti venture capital atau angel investment.',
        'education' => 'Gunakan pedagogical approaches yang sesuai dengan target audience, implementasikan assessment tools untuk learning evaluation, dan pertimbangkan blended learning methods.',
        'general' => 'Lakukan thorough research sebelum implementasi, dokumentasikan seluruh proses, dan siapkan contingency plan untuk risk mitigation.'
    ];
    
    return $recommendations[$requestType] ?? '';
}

/**
 * Generate statistics for the processed prompt
 */
function generatePromptStatistics($text, $model) {
    $wordCount = str_word_count($text);
    $charCount = strlen($text);
    $sentenceCount = preg_match_all('/[.!?]+/', $text);
    $paragraphCount = substr_count($text, "\n\n") + 1;
    
    // Calculate reading time (average 200 words per minute)
    $readingTime = ceil($wordCount / 200);
    
    // Calculate processing complexity score
    $complexityScore = min(100, ceil(($wordCount * 0.3) + ($charCount * 0.1) + ($paragraphCount * 20)));
    
    // Determine difficulty level
    if ($complexityScore > 80) {
        $difficulty = 'Advanced';
    } elseif ($complexityScore > 50) {
        $difficulty = 'Intermediate';
    } else {
        $difficulty = 'Beginner';
    }
    
    return [
        'word_count' => $wordCount,
        'char_count' => $charCount,
        'sentence_count' => $sentenceCount,
        'paragraph_count' => $paragraphCount,
        'reading_time_minutes' => $readingTime,
        'complexity_score' => $complexityScore,
        'difficulty_level' => $difficulty,
        'model_used' => $model,
        'processing_time' => rand(10, 30) / 10 // 1.0 - 3.0 seconds
    ];
}

// ============================================
// MAIN REQUEST HANDLER
// ============================================

try {
    // Get request method
    $method = $_SERVER['REQUEST_METHOD'];
    
    if ($method === 'POST') {
        // Get JSON input
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate input
        if (!isset($input['prompt']) || !isset($input['model'])) {
            throw new Exception('Missing required parameters: prompt and model');
        }
        
        $userPrompt = trim($input['prompt']);
        $model = $input['model'];
        
        // Validate prompt
        if (empty($userPrompt)) {
            throw new Exception('Prompt cannot be empty');
        }
        
        if (strlen($userPrompt) < 5) {
            throw new Exception('Prompt must be at least 5 characters long');
        }
        
        if (strlen($userPrompt) > 1000) {
            throw new Exception('Prompt cannot exceed 1000 characters');
        }
        
        // Generate refined prompt based on model
        if ($model === 'advanced') {
            $refinedPrompt = generateAdvancedPrompt($userPrompt);
        } else {
            $refinedPrompt = generateFastPrompt($userPrompt);
        }
        
        // Generate statistics
        $stats = generatePromptStatistics($refinedPrompt, $model);
        
        // Generate unique ID for this request
        $requestId = 'PREMIUM_' . date('YmdHis') . '_' . uniqid();
        
        // Prepare success response
        $response = [
            'success' => true,
            'request_id' => $requestId,
            'data' => [
                'original' => $userPrompt,
                'refined' => $refinedPrompt,
                'model' => $model,
                'statistics' => $stats,
                'metadata' => [
                    'version' => '2.0-premium',
                    'timestamp' => date('Y-m-d H:i:s'),
                    'processing_delay_ms' => $processingDelay / 1000,
                    'server_timezone' => 'Asia/Jakarta',
                    'premium_features' => [
                        'advanced_text_processing',
                        'contextual_analysis',
                        'multi_paragraph_output',
                        'statistical_analysis',
                        'expert_recommendations'
                    ]
                ]
            ]
        ];
        
    } elseif ($method === 'GET') {
        // Sample response for GET requests (for testing)
        $samplePrompt = 'bikinin saya kode python buat web scraping';
        $sampleModel = 'fast';
        
        $refinedPrompt = generateFastPrompt($samplePrompt);
        $stats = generatePromptStatistics($refinedPrompt, $sampleModel);
        
        $response = [
            'success' => true,
            'message' => 'AI Prompt Refiner Premium API is running',
            'sample' => [
                'original' => $samplePrompt,
                'refined' => $refinedPrompt,
                'model' => $sampleModel,
                'statistics' => $stats
            ],
            'api_info' => [
                'version' => '2.0-premium',
                'endpoints' => ['POST /', 'GET /'],
                'features' => ['fast_model', 'advanced_model', 'voice_input', '50+_animations'],
                'status' => 'operational'
            ]
        ];
        
    } else {
        throw new Exception('Method not allowed');
    }
    
} catch (Exception $e) {
    // Error response
    $response = [
        'success' => false,
        'error' => $e->getMessage(),
        'error_code' => 'PREMIUM_ERROR_' . strtoupper(str_replace(' ', '_', $e->getMessage())),
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    http_response_code(400);
}

// Send JSON response
echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
