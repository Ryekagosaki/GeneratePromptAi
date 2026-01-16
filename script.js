// Variabel global
let currentModel = 'fast';
let isProcessing = false;
let recognition = null;
let isRecording = false;
let recordingStartTime = null;
let recordingTimer = null;
let voicePermissionGranted = false;

// Data contoh prompt yang sudah diperbaiki
const improvedExamples = {
    "bikinin saya kode python buat web scraping": "Sebagai pengembang Python berpengalaman, mohon buatkan cuplikan kode Python yang bersih dan terdokumentasi dengan baik untuk melakukan web scraping dari situs web, dengan memperhatikan etika dan praktik terbaik.",
    "saya butuh bantuan buat nulis email ke client": "Sebagai asisten profesional, tolong bantu saya menyusun email yang sopan dan efektif untuk dikirim kepada klien, dengan struktur yang jelas dan bahasa yang profesional.",
    "cara buat aplikasi android sederhana": "Sebagai ahli pengembangan Android, jelaskan langkah-langkah sistematis untuk membuat aplikasi Android sederhana dari awal, termasuk alat yang diperlukan dan konsep dasar yang harus dipahami.",
    "tolong jelaskan machine learning untuk pemula": "Sebagai pakar machine learning, berikan penjelasan yang komprehensif tentang machine learning untuk pemula, dengan contoh praktis dan analogi yang mudah dipahami."
};

// Tips untuk loading
const loadingTips = [
    "Memperbaiki tata bahasa dan ejaan...",
    "Menganalisis konteks permintaan...",
    "Menyusun struktur yang lebih baik...",
    "Menambahkan detail profesional...",
    "Mengoptimalkan kalimat untuk hasil terbaik...",
    "Memeriksa konsistensi bahasa..."
];

// Fungsi untuk inisialisasi Web Speech API
function initializeSpeechRecognition() {
    // Cek dukungan browser
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showNotification('Browser Anda tidak mendukung fitur voice recognition', 'error');
        return false;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    // Konfigurasi untuk bahasa Indonesia
    recognition.lang = 'id-ID';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    
    // Event handlers
    recognition.onstart = function() {
        console.log('Voice recognition started');
        isRecording = true;
        recordingStartTime = Date.now();
        updateRecordingTimer();
        showNotification('Mendengarkan... Silakan bicara sekarang', 'info');
    };
    
    recognition.onresult = function(event) {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                transcript += event.results[i][0].transcript;
            } else {
                transcript += event.results[i][0].transcript;
            }
        }
        
        // Update textarea dengan hasil transkripsi
        if (transcript.trim() !== '') {
            document.getElementById('userPrompt').value = transcript;
            updateCharCount();
        }
    };
    
    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        
        if (event.error === 'not-allowed') {
            showNotification('Akses mikrofon ditolak. Silakan izinkan akses mikrofon.', 'error');
            voicePermissionGranted = false;
        } else if (event.error === 'no-speech') {
            showNotification('Tidak ada suara terdeteksi. Silakan coba lagi.', 'warning');
        } else if (event.error === 'audio-capture') {
            showNotification('Tidak ada mikrofon yang terdeteksi.', 'error');
        }
        
        stopVoiceRecording();
    };
    
    recognition.onend = function() {
        console.log('Voice recognition ended');
        stopVoiceRecording();
    };
    
    return true;
}

// Fungsi untuk meminta izin mikrofon
function requestMicrophonePermission() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showNotification('Browser Anda tidak mendukung akses mikrofon', 'error');
        return false;
    }
    
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            console.log('Microphone access granted');
            voicePermissionGranted = true;
            showNotification('Akses mikrofon diberikan. Klik tombol suara lagi untuk mulai merekam.', 'success');
            document.getElementById('permissionModal').classList.remove('active');
            
            // Stop semua track setelah mendapatkan izin
            stream.getTracks().forEach(track => track.stop());
        })
        .catch(function(err) {
            console.error('Microphone access denied:', err);
            showNotification('Akses mikrofon ditolak. Fitur suara tidak dapat digunakan.', 'error');
            voicePermissionGranted = false;
            document.getElementById('permissionModal').classList.remove('active');
        });
    
    return true;
}

// Fungsi untuk memulai rekaman suara
function startVoiceRecording() {
    if (!recognition) {
        if (!initializeSpeechRecognition()) {
            return;
        }
    }
    
    if (!voicePermissionGranted) {
        document.getElementById('permissionModal').classList.add('active');
        return;
    }
    
    try {
        recognition.start();
        document.getElementById('voiceStatus').style.display = 'flex';
        document.getElementById('userPrompt').disabled = true;
        showNotification('Rekaman suara dimulai', 'info');
    } catch (error) {
        console.error('Failed to start recording:', error);
        showNotification('Gagal memulai rekaman suara', 'error');
    }
}

// Fungsi untuk menghentikan rekaman suara
function stopVoiceRecording() {
    if (recognition && isRecording) {
        try {
            recognition.stop();
        } catch (error) {
            console.error('Error stopping recognition:', error);
        }
    }
    
    isRecording = false;
    document.getElementById('voiceStatus').style.display = 'none';
    document.getElementById('userPrompt').disabled = false;
    
    if (recordingTimer) {
        clearInterval(recordingTimer);
        recordingTimer = null;
    }
    
    document.getElementById('recordingTime').textContent = '00:00';
    showNotification('Rekaman suara dihentikan', 'info');
}

// Fungsi untuk memperbarui timer rekaman
function updateRecordingTimer() {
    if (recordingTimer) {
        clearInterval(recordingTimer);
    }
    
    recordingTimer = setInterval(function() {
        if (recordingStartTime) {
            const elapsed = Date.now() - recordingStartTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            document.getElementById('recordingTime').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

// Fungsi untuk memperbaiki teks (simulasi AI)
function improveText(text) {
    // Kasus-kasus umum yang akan diperbaiki
    const improvements = {
        "bikinin": "buatkan",
        "bikin": "buat",
        "nggak": "tidak",
        "gak": "tidak",
        "gimana": "bagaimana",
        "gmn": "bagaimana",
        "aja": "saja",
        "sih": "",
        "dong": "",
        "ya": "",
        "nih": "",
        "deh": "",
        "bgt": "sekali",
        "banget": "sekali",
        "dong": "",
        "loh": "",
        "weh": "",
        "sama": "dengan",
        "kaya": "seperti",
        "kyk": "seperti",
        "kek": "seperti",
        "klo": "jika",
        "kalo": "jika",
        "klu": "jika",
        "klw": "jika"
    };
    
    // Perbaiki kata per kata
    let words = text.split(' ');
    let improvedWords = words.map(word => {
        const lowerWord = word.toLowerCase();
        return improvements[lowerWord] || word;
    });
    
    let result = improvedWords.join(' ');
    
    // Tambahkan awalan yang lebih profesional berdasarkan model
    if (currentModel === 'advanced') {
        if (text.toLowerCase().includes('kode') || text.toLowerCase().includes('code') || text.toLowerCase().includes('python') || text.toLowerCase().includes('program')) {
            result = "Sebagai pengembang Python berpengalaman, mohon buatkan cuplikan kode Python yang bersih dan terdokumentasi dengan baik yang menyelesaikan tugas berikut: " + result;
        } else if (text.toLowerCase().includes('tulis') || text.toLowerCase().includes('email') || text.toLowerCase().includes('surat') || text.toLowerCase().includes('dokumen')) {
            result = "Sebagai asisten penulis profesional, mohon bantu saya menyusun konten berikut dengan struktur yang jelas dan bahasa yang efektif: " + result;
        } else if (text.toLowerCase().includes('jelaskan') || text.toLowerCase().includes('apa itu') || text.toLowerCase().includes('bagaimana')) {
            result = "Sebagai ahli dalam bidang ini, berikan penjelasan yang komprehensif dan mudah dipahami tentang: " + result;
        } else {
            result = "Mohon bantu saya dengan: " + result;
        }
    } else {
        // Model cepat - hanya perbaiki tata bahasa dasar
        result = result.charAt(0).toUpperCase() + result.slice(1);
        
        // Tambahkan titik jika belum ada
        if (!result.endsWith('.') && !result.endsWith('?') && !result.endsWith('!')) {
            result += '.';
        }
    }
    
    return result;
}

// Fungsi untuk menghitung karakter
function updateCharCount() {
    const textarea = document.getElementById('userPrompt');
    const charCount = document.getElementById('charCount');
    const count = textarea.value.length;
    
    charCount.textContent = count;
    
    // Ubah warna jika mendekati batas
    if (count > 900) {
        charCount.style.color = '#ef4444';
    } else if (count > 700) {
        charCount.style.color = '#f59e0b';
    } else {
        charCount.style.color = '#3b82f6';
    }
}

// Fungsi untuk menampilkan loading
function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
    isProcessing = true;
    
    // Pilih tip secara acak
    const randomTip = loadingTips[Math.floor(Math.random() * loadingTips.length)];
    document.getElementById('loadingTip').textContent = randomTip;
    
    // Timeout keselamatan untuk mencegah stuck
    setTimeout(() => {
        if (isProcessing) {
            hideLoading();
            showNotification('Proses terlalu lama. Silakan coba lagi.', 'warning');
        }
    }, 10000); // 10 detik timeout
}

// Fungsi untuk menyembunyikan loading
function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
    isProcessing = false;
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    // Set warna berdasarkan tipe
    if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ef4444, #f87171)';
    } else if (type === 'warning') {
        notification.style.background = 'linear-gradient(135deg, #f59e0b, #fbbf24)';
    } else if (type === 'info') {
        notification.style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
    }
    
    notificationText.textContent = message;
    notification.classList.add('show');
    
    // Sembunyikan setelah 3 detik
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Fungsi untuk menyalin teks ke clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Prompt berhasil disalin ke clipboard!');
    }).catch(err => {
        console.error('Gagal menyalin: ', err);
        showNotification('Gagal menyalin prompt', 'error');
    });
}

// Fungsi untuk memproses prompt (dengan AJAX ke PHP)
function processPrompt() {
    const userPrompt = document.getElementById('userPrompt').value.trim();
    
    if (!userPrompt) {
        showNotification('Silakan masukkan prompt terlebih dahulu', 'warning');
        return;
    }
    
    if (userPrompt.length < 5) {
        showNotification('Prompt terlalu pendek', 'warning');
        return;
    }
    
    showLoading();
    
    // Kirim ke server PHP untuk diproses
    fetch('refine.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: userPrompt,
            model: currentModel
        })
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        
        if (data.success) {
            displayRefinedPrompt(data.data);
            showNotification('Prompt berhasil diperbaiki!', 'success');
        } else {
            showNotification(data.error || 'Terjadi kesalahan', 'error');
            // Fallback ke client-side processing
            fallbackProcessPrompt(userPrompt);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        hideLoading();
        showNotification('Koneksi bermasalah, menggunakan proses lokal', 'warning');
        // Fallback ke client-side processing
        fallbackProcessPrompt(userPrompt);
    });
}

// Fallback processing jika server tidak responsif
function fallbackProcessPrompt(userPrompt) {
    // Perbaiki prompt secara lokal
    let improvedPrompt = improveText(userPrompt);
    
    // Tampilkan hasil
    displayRefinedPrompt({
        refined: improvedPrompt,
        model: currentModel,
        word_count: improvedPrompt.split(' ').length,
        processing_time: (Math.random() * 2 + 0.5).toFixed(1)
    });
    
    showNotification('Prompt berhasil diperbaiki (proses lokal)', 'success');
}

// Fungsi untuk menampilkan hasil prompt yang sudah diperbaiki
function displayRefinedPrompt(data) {
    const promptPlaceholder = document.getElementById('promptPlaceholder');
    const promptContent = document.getElementById('refinedPromptText');
    
    promptPlaceholder.style.display = 'none';
    promptContent.style.display = 'block';
    promptContent.innerHTML = `
        <div class="model-badge">
            <i class="fas fa-${data.model === 'fast' ? 'bolt' : 'brain'}"></i>
            Model ${data.model === 'fast' ? 'Cepat' : 'Lanjutan'}
        </div>
        <p>${data.refined}</p>
        <div class="prompt-stats">
            <span><i class="fas fa-clock"></i> Diproses dalam ${data.processing_time} detik</span>
            <span><i class="fas fa-chart-bar"></i> ${data.word_count} kata</span>
        </div>
    `;
    
    // Animasi pada hasil
    promptContent.classList.add('animate-fade-in');
    
    // Scroll ke hasil
    promptContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Fungsi untuk generate prompt otomatis
function generatePrompt() {
    fetch('generate.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('userPrompt').value = data.data.prompt;
                updateCharCount();
                showNotification('Prompt contoh telah dimuat!', 'success');
                
                // Animasi pada textarea
                const textarea = document.getElementById('userPrompt');
                textarea.classList.add('animate-pulse');
                setTimeout(() => {
                    textarea.classList.remove('animate-pulse');
                }, 1000);
            } else {
                // Fallback ke prompt lokal
                const prompts = [
                    "Buatkan saya kode Python untuk analisis data dengan pandas",
                    "Jelaskan konsep blockchain secara sederhana",
                    "Bantu saya menulis proposal bisnis untuk startup teknologi",
                    "Buatkan desain UI untuk aplikasi mobile e-commerce",
                    "Jelaskan perbedaan antara AI, machine learning, dan deep learning",
                    "Bantu saya menulis email follow-up setelah meeting",
                    "Buatkan script Python untuk otomasi tugas sehari-hari",
                    "Jelaskan cara kerja neural network dengan analogi sederhana"
                ];
                
                const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
                document.getElementById('userPrompt').value = randomPrompt;
                updateCharCount();
                showNotification('Prompt contoh telah dimuat!', 'success');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Fallback ke prompt lokal
            const prompts = [
                "Buatkan saya kode Python untuk analisis data dengan pandas",
                "Jelaskan konsep blockchain secara sederhana",
                "Bantu saya menulis proposal bisnis untuk startup teknologi",
                "Buatkan desain UI untuk aplikasi mobile e-commerce",
                "Jelaskan perbedaan antara AI, machine learning, dan deep learning"
            ];
            
            const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
            document.getElementById('userPrompt').value = randomPrompt;
            updateCharCount();
            showNotification('Prompt contoh telah dimuat! (offline)', 'info');
        });
}

// Event Listeners saat DOM selesai dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Update penghitung karakter
    updateCharCount();
    
    // Event listener untuk textarea
    document.getElementById('userPrompt').addEventListener('input', updateCharCount);
    
    // Event listener untuk tombol perbaiki prompt
    document.getElementById('improveBtn').addEventListener('click', processPrompt);
    
    // Event listener untuk tombol generate prompt
    document.getElementById('generateBtn').addEventListener('click', generatePrompt);
    
    // Event listener untuk tombol copy
    document.getElementById('copyBtn').addEventListener('click', function() {
        const promptElement = document.getElementById('refinedPromptText');
        if (promptElement && promptElement.style.display !== 'none') {
            const promptText = promptElement.querySelector('p')?.textContent || '';
            if (promptText.trim() !== '') {
                copyToClipboard(promptText);
            } else {
                showNotification('Tidak ada prompt untuk disalin', 'warning');
            }
        } else {
            showNotification('Tidak ada prompt untuk disalin', 'warning');
        }
    });
    
    // Event listener untuk pilihan model
    document.querySelectorAll('.model-option').forEach(option => {
        option.addEventListener('click', function() {
            // Hapus active dari semua opsi
            document.querySelectorAll('.model-option').forEach(opt => {
                opt.classList.remove('active');
            });
            
            // Tambahkan active ke opsi yang diklik
            this.classList.add('active');
            currentModel = this.getAttribute('data-model');
            
            // Animasi
            this.classList.add('animate-bounce');
            setTimeout(() => {
                this.classList.remove('animate-bounce');
            }, 1000);
            
            showNotification(`Model ${currentModel === 'fast' ? 'Cepat' : 'Lanjutan'} dipilih`);
        });
    });
    
    // Event listener untuk contoh prompt
    document.querySelectorAll('.example-card').forEach(card => {
        card.addEventListener('click', function() {
            const prompt = this.getAttribute('data-prompt');
            document.getElementById('userPrompt').value = prompt;
            updateCharCount();
            
            // Animasi pada card
            this.classList.add('animate-pulse');
            setTimeout(() => {
                this.classList.remove('animate-pulse');
            }, 1000);
            
            // Otomatis proses prompt setelah 300ms
            setTimeout(processPrompt, 300);
        });
    });
    
    // Event listener untuk mode input
    document.getElementById('textModeBtn').addEventListener('click', function() {
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
        
        // Pastikan voice recording dihentikan
        stopVoiceRecording();
    });
    
    document.getElementById('voiceModeBtn').addEventListener('click', function() {
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
        
        // Mulai voice recording
        startVoiceRecording();
    });
    
    // Event listener untuk tombol stop voice
    document.getElementById('stopVoiceBtn').addEventListener('click', stopVoiceRecording);
    
    // Event listener untuk modal permission
    document.getElementById('requestPermissionBtn').addEventListener('click', requestMicrophonePermission);
    document.getElementById('cancelPermissionBtn').addEventListener('click', function() {
        document.getElementById('permissionModal').classList.remove('active');
        showNotification('Fitur suara dinonaktifkan', 'info');
        
        // Kembali ke mode teks
        document.getElementById('textModeBtn').click();
    });
    
    // Event listener untuk animasi demo
    document.querySelectorAll('.anim-item').forEach(item => {
        item.addEventListener('click', function() {
            const animName = this.textContent;
            const animClass = this.classList[1];
            
            // Aktifkan animasi
            this.classList.add(animClass);
            
            // Hapus setelah selesai
            setTimeout(() => {
                this.classList.remove(animClass);
            }, 2000);
            
            showNotification(`Animasi "${animName}" diaktifkan`);
        });
    });
    
    // Submit form dengan Enter (tidak refresh halaman)
    document.getElementById('userPrompt').addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            processPrompt();
        }
    });
    
    // Inisialisasi speech recognition
    initializeSpeechRecognition();
    
    // Cek apakah browser mendukung voice
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        document.getElementById('voiceModeBtn').disabled = true;
        document.getElementById('voiceModeBtn').innerHTML = '<i class="fas fa-microphone-slash"></i> Suara (Tidak Didukung)';
        document.getElementById('voiceModeBtn').title = 'Browser Anda tidak mendukung fitur suara';
    }
    
    // Inisialisasi animasi header
    const title = document.querySelector('.title');
    setInterval(() => {
        title.classList.toggle('animate-text-gradient');
    }, 5000);
});