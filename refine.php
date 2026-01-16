<?php
// Tambahkan header untuk CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Tambahkan delay kecil untuk simulasi processing
usleep(rand(500000, 1500000)); // 0.5 - 1.5 detik

// Fungsi untuk memperbaiki teks Indonesia
function improveIndonesianText($text) {
    // Kamus perbaikan kata tidak baku -> baku
    $improvements = [
        // Kata tidak baku -> baku
        'bikinin' => 'buatkan',
        'bikin' => 'buat',
        'nggak' => 'tidak',
        'gak' => 'tidak',
        'gimana' => 'bagaimana',
        'gmn' => 'bagaimana',
        'aja' => 'saja',
        'sih' => '',
        'dong' => '',
        'ya' => '',
        'nih' => '',
        'deh' => '',
        'bgt' => 'sekali',
        'banget' => 'sekali',
        'dongs' => '',
        'loh' => '',
        'weh' => '',
        'sama' => 'dengan',
        'kaya' => 'seperti',
        'kyk' => 'seperti',
        'kek' => 'seperti',
        'klo' => 'jika',
        'kalo' => 'jika',
        'klu' => 'jika',
        'klw' => 'jika',
        'jwbn' => 'jawaban',
        'jwb' => 'jawab',
        'bngt' => 'sekali',
        'bgtt' => 'sekali',
        'skli' => 'sekali',
        'sklian' => 'sekalian',
        'sblm' => 'sebelum',
        'sdh' => 'sudah',
        'udh' => 'sudah',
        'udah' => 'sudah',
        'blm' => 'belum',
        'blum' => 'belum',
        'sm' => 'sama',
        'smua' => 'semua',
        'smw' => 'semua',
        'tp' => 'tapi',
        'tpi' => 'tapi',
        'tapi' => 'tetapi',
        'yg' => 'yang',
        'org' => 'orang',
        'krn' => 'karena',
        'knp' => 'kenapa',
        'knpa' => 'kenapa',
        'mksd' => 'maksud',
        'brp' => 'berapa',
        'brpa' => 'berapa',
        'lg' => 'lagi',
        'lgi' => 'lagi',
        'dtg' => 'datang',
        'dtng' => 'datang',
        'dtngin' => 'datangkan',
        'mw' => 'mau',
        'mau' => 'ingin',
        'pgn' => 'ingin',
        'pengen' => 'ingin',
        'pngen' => 'ingin',
        'msh' => 'masih',
        'msi' => 'masih',
        'gpp' => 'tidak apa-apa',
        'gapapa' => 'tidak apa-apa',
        'gapa' => 'tidak apa-apa',
        'jg' => 'juga',
        'jga' => 'juga',
        'jgn' => 'jangan',
        'jangan' => 'tolong jangan',
        'sblmnya' => 'sebelumnya',
        'trims' => 'terima kasih',
        'trima kasih' => 'terima kasih',
        'makasih' => 'terima kasih',
        'mksh' => 'terima kasih',
        'thx' => 'terima kasih',
        'ty' => 'terima kasih',
        'ok' => 'baik',
        'oke' => 'baik',
        'okey' => 'baik',
        'ok deh' => 'baik',
        'pls' => 'tolong',
        'please' => 'tolong',
        'tolongin' => 'tolong',
        'bantuin' => 'bantu',
        'bntuin' => 'bantu',
        'bntu' => 'bantu',
        // Tambahan untuk bahasa programming
        'coding' => 'pemrograman',
        'ngoding' => 'memprogram',
        'debug' => 'men-debug',
        'error' => 'kesalahan',
        'bug' => 'kutu',
        'script' => 'skrip',
        'program' => 'program',
        'apps' => 'aplikasi',
        'app' => 'aplikasi',
        'web' => 'situs web',
        'website' => 'situs web',
        'online' => 'daring',
        'offline' => 'luring',
    ];
    
    // Pisahkan teks menjadi kata-kata
    $words = explode(' ', $text);
    $improvedWords = [];
    
    foreach ($words as $word) {
        $lowerWord = strtolower($word);
        
        if (isset($improvements[$lowerWord])) {
            $improvedWords[] = $improvements[$lowerWord];
        } else {
            $improvedWords[] = $word;
        }
    }
    
    // Gabungkan kembali
    $result = implode(' ', $improvedWords);
    
    // Kapitalisasi huruf pertama
    $result = ucfirst($result);
    
    // Tambahkan titik jika belum ada tanda baca di akhir
    if (!preg_match('/[.!?]$/', $result)) {
        $result .= '.';
    }
    
    // Perbaiki spasi ganda
    $result = preg_replace('/\s+/', ' ', $result);
    
    return $result;
}

// Fungsi untuk membuat prompt lebih profesional
function makePromptProfessional($text, $model = 'fast') {
    $improvedText = improveIndonesianText($text);
    
    // Deteksi jenis permintaan
    $isCodeRequest = preg_match('/(kode|code|program|script|python|java|javascript|html|css|php|sql|coding|pemrograman)/i', $text);
    $isWritingRequest = preg_match('/(tulis|tulisan|email|surat|artikel|blog|dokumen|proposal|laporan)/i', $text);
    $isExplanationRequest = preg_match('/(jelaskan|apa itu|bagaimana|cara|tutorial|panduan)/i', $text);
    
    if ($model === 'advanced') {
        if ($isCodeRequest) {
            return "Sebagai pengembang perangkat lunak berpengalaman, mohon buatkan cuplikan kode yang bersih, terdokumentasi dengan baik, dan mengikuti praktik terbaik untuk: " . $improvedText;
        } elseif ($isWritingRequest) {
            return "Sebagai penulis profesional, tolong bantu saya menyusun konten berikut dengan struktur yang jelas, bahasa yang efektif, dan tone yang sesuai: " . $improvedText;
        } elseif ($isExplanationRequest) {
            return "Sebagai ahli dalam bidang terkait, berikan penjelasan yang komprehensif, mudah dipahami, dan disertai contoh yang relevan tentang: " . $improvedText;
        } else {
            return "Mohon bantu saya dengan permintaan berikut dengan pendekatan yang sistematis dan detail: " . $improvedText;
        }
    } else {
        // Model cepat
        return $improvedText;
    }
}

// Ambil data dari request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Dapatkan input JSON
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['prompt']) && isset($input['model'])) {
        $userPrompt = trim($input['prompt']);
        $model = $input['model'];
        
        if (empty($userPrompt)) {
            echo json_encode([
                'success' => false,
                'error' => 'Prompt tidak boleh kosong'
            ]);
            exit;
        }
        
        // Proses prompt
        $refinedPrompt = makePromptProfessional($userPrompt, $model);
        
        // Hitung statistik
        $wordCount = str_word_count($refinedPrompt);
        $charCount = strlen($refinedPrompt);
        $processingTime = rand(10, 30) / 10; // Waktu acak 1.0-3.0 detik
        
        echo json_encode([
            'success' => true,
            'data' => [
                'original' => $userPrompt,
                'refined' => $refinedPrompt,
                'model' => $model,
                'word_count' => $wordCount,
                'char_count' => $charCount,
                'processing_time' => $processingTime,
                'timestamp' => date('Y-m-d H:i:s')
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Data tidak lengkap'
        ]);
    }
} else {
    // Untuk GET request, kembalikan contoh
    echo json_encode([
        'success' => true,
        'data' => [
            'original' => 'bikinin saya kode python buat web scraping',
            'refined' => 'Buatkan saya kode python buat web scraping.',
            'model' => 'fast',
            'word_count' => 7,
            'char_count' => 42,
            'processing_time' => 1.2,
            'timestamp' => date('Y-m-d H:i:s')
        ]
    ]);
}
?>