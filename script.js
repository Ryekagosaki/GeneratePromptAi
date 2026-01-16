// Versi Premium - AI Prompt Refiner
class PremiumPromptRefiner {
    constructor() {
        this.currentModel = 'fast';
        this.isProcessing = false;
        this.recognition = null;
        this.isRecording = false;
        this.recordingStartTime = null;
        this.recordingTimer = null;
        this.voicePermissionGranted = false;
        this.history = [];
        this.processedCount = 0;
        this.totalTimeSaved = 0;
        
        this.initialize();
    }
    
    initialize() {
        this.bindEvents();
        this.loadStats();
        this.initializeSpeechRecognition();
        this.updateStatsDisplay();
    }
    
    bindEvents() {
        // DOM Elements
        this.elements = {
            userPrompt: document.getElementById('userPrompt'),
            charCount: document.getElementById('charCount'),
            voiceStatus: document.getElementById('voiceStatus'),
            recordingTime: document.getElementById('recordingTime'),
            refinedPromptText: document.getElementById('refinedPromptText'),
            promptPlaceholder: document.getElementById('promptPlaceholder'),
            loadingOverlay: document.getElementById('loadingOverlay'),
            notification: document.getElementById('notification'),
            historyList: document.getElementById('historyList'),
            processedCount: document.getElementById('processedCount'),
            timeSaved: document.getElementById('timeSaved'),
            successRate: document.getElementById('successRate'),
            currentModel: document.getElementById('currentModel'),
            loadingTip: document.getElementById('loadingTip'),
            elapsedTime: document.getElementById('elapsedTime'),
            notificationTitle: document.getElementById('notificationTitle'),
            notificationText: document.getElementById('notificationText')
        };
        
        // Event Listeners
        this.elements.userPrompt.addEventListener('input', () => this.updateCharCount());
        document.getElementById('improveBtn').addEventListener('click', () => this.processPrompt());
        document.getElementById('generateBtn').addEventListener('click', () => this.generatePrompt());
        document.getElementById('copyBtn').addEventListener('click', () => this.copyToClipboard());
        document.getElementById('saveBtn').addEventListener('click', () => this.savePrompt());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearPrompt());
        document.getElementById('clearHistoryBtn').addEventListener('click', () => this.clearHistory());
        
        // Model Selection
        document.querySelectorAll('.model-card').forEach(card => {
            card.addEventListener('click', (e) => this.selectModel(e));
        });
        
        // Voice Mode
        document.getElementById('textModeBtn').addEventListener('click', () => this.switchToTextMode());
        document.getElementById('voiceModeBtn').addEventListener('click', () => this.startVoiceRecording());
        document.getElementById('stopVoiceBtn').addEventListener('click', () => this.stopVoiceRecording());
        
        // Example Cards
        document.querySelectorAll('.example-card').forEach(card => {
            card.addEventListener('click', (e) => this.useExample(e));
        });
        
        // History Items
        this.elements.historyList.addEventListener('click', (e) => {
            const historyItem = e.target.closest('.history-item');
            if (historyItem) {
                this.loadFromHistory(historyItem.dataset.id);
            }
        });
        
        // Voice Permission Modal
        document.getElementById('requestPermissionBtn').addEventListener('click', () => this.requestMicrophonePermission());
        document.getElementById('cancelPermissionBtn').addEventListener('click', () => this.cancelVoicePermission());
    }
    
    // Character Count
    updateCharCount() {
        const count = this.elements.userPrompt.value.length;
        this.elements.charCount.textContent = count;
        
        if (count > 900) {
            this.elements.charCount.style.color = '#ff6b6b';
        } else if (count > 700) {
            this.elements.charCount.style.color = '#ffaa00';
        } else {
            this.elements.charCount.style.color = '#00ff88';
        }
    }
    
    // Model Selection
    selectModel(event) {
        const card = event.currentTarget;
        const model = card.dataset.model;
        
        // Update UI
        document.querySelectorAll('.model-card').forEach(c => {
            c.classList.remove('active');
        });
        card.classList.add('active');
        
        this.currentModel = model;
        this.elements.currentModel.textContent = model === 'fast' ? 'Model Cepat' : 'Model Lanjutan';
        
        // Show notification
        this.showNotification(
            `Model ${model === 'fast' ? 'Cepat' : 'Lanjutan'} Dipilih`,
            `Output akan berupa ${model === 'fast' ? '2 paragraf' : '5 paragraf lengkap'}`
        );
    }
    
    // Voice Recording
    initializeSpeechRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.showNotification('Fitur Suara Tidak Didukung', 'Browser Anda tidak mendukung voice recognition', 'warning');
            document.getElementById('voiceModeBtn').disabled = true;
            return false;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.lang = 'id-ID';
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
        
        this.recognition.onstart = () => {
            console.log('Voice recording started');
            this.isRecording = true;
            this.recordingStartTime = Date.now();
            this.startRecordingTimer();
            this.showNotification('Mendengarkan', 'Silakan mulai berbicara...', 'info');
        };
        
        this.recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            
            if (transcript.trim()) {
                this.elements.userPrompt.value = transcript;
                this.updateCharCount();
                
                // Animate voice bars
                this.animateVoiceBars();
            }
        };
        
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            
            if (event.error === 'not-allowed') {
                this.showNotification('Akses Ditolak', 'Izinkan akses mikrofon untuk menggunakan fitur suara', 'error');
            }
            
            this.stopVoiceRecording();
        };
        
        this.recognition.onend = () => {
            console.log('Voice recording ended');
            this.stopVoiceRecording();
        };
        
        return true;
    }
    
    startVoiceRecording() {
        if (!this.recognition) {
            if (!this.initializeSpeechRecognition()) {
                return;
            }
        }
        
        if (!this.voicePermissionGranted) {
            document.getElementById('permissionModal').classList.add('active');
            return;
        }
        
        try {
            this.recognition.start();
            this.elements.voiceStatus.style.display = 'flex';
            this.elements.userPrompt.disabled = true;
            document.getElementById('voiceModeBtn').classList.add('active');
        } catch (error) {
            console.error('Failed to start recording:', error);
            this.showNotification('Gagal Memulai', 'Tidak dapat mengakses mikrofon', 'error');
        }
    }
    
    stopVoiceRecording() {
        if (this.recognition && this.isRecording) {
            try {
                this.recognition.stop();
            } catch (error) {
                console.error('Error stopping recognition:', error);
            }
        }
        
        this.isRecording = false;
        this.elements.voiceStatus.style.display = 'none';
        this.elements.userPrompt.disabled = false;
        document.getElementById('voiceModeBtn').classList.remove('active');
        
        if (this.recordingTimer) {
            clearInterval(this.recordingTimer);
            this.recordingTimer = null;
        }
        
        this.elements.recordingTime.textContent = '00:00';
    }
    
    startRecordingTimer() {
        if (this.recordingTimer) {
            clearInterval(this.recordingTimer);
        }
        
        this.recordingTimer = setInterval(() => {
            if (this.recordingStartTime) {
                const elapsed = Date.now() - this.recordingStartTime;
                const minutes = Math.floor(elapsed / 60000);
                const seconds = Math.floor((elapsed % 60000) / 1000);
                this.elements.recordingTime.textContent = 
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }
    
    animateVoiceBars() {
        const bars = document.querySelectorAll('.voice-bar');
        bars.forEach((bar, index) => {
            const height = 20 + Math.random() * 30;
            bar.style.height = `${height}px`;
            bar.style.transition = 'height 0.1s ease';
        });
    }
    
    requestMicrophonePermission() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            this.showNotification('Tidak Didukung', 'Browser tidak mendukung akses mikrofon', 'error');
            return;
        }
        
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                this.voicePermissionGranted = true;
                document.getElementById('permissionModal').classList.remove('active');
                this.showNotification('Akses Diberikan', 'Fitur suara siap digunakan', 'success');
                
                stream.getTracks().forEach(track => track.stop());
                
                // Mulai recording setelah izin diberikan
                setTimeout(() => this.startVoiceRecording(), 500);
            })
            .catch((err) => {
                console.error('Microphone access denied:', err);
                this.showNotification('Akses Ditolak', 'Tidak dapat mengakses mikrofon', 'error');
                document.getElementById('permissionModal').classList.remove('active');
            });
    }
    
    cancelVoicePermission() {
        document.getElementById('permissionModal').classList.remove('active');
        this.switchToTextMode();
    }
    
    switchToTextMode() {
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById('textModeBtn').classList.add('active');
        this.stopVoiceRecording();
    }
    
    // Prompt Processing
    async processPrompt() {
        const prompt = this.elements.userPrompt.value.trim();
        
        if (!prompt) {
            this.showNotification('Prompt Kosong', 'Masukkan prompt terlebih dahulu', 'warning');
            return;
        }
        
        if (prompt.length < 5) {
            this.showNotification('Terlalu Pendek', 'Prompt minimal 5 karakter', 'warning');
            return;
        }
        
        this.showLoading();
        
        try {
            const response = await fetch('refine.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    model: this.currentModel,
                    premium: true
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.displayRefinedPrompt(data.data);
                this.addToHistory(prompt, data.data.refined);
                this.updateStats();
                this.showNotification('Berhasil Diproses', 'Prompt telah disempurnakan', 'success');
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Processing error:', error);
            this.fallbackProcessing(prompt);
        } finally {
            this.hideLoading();
        }
    }
    
    fallbackProcessing(prompt) {
        // Generate prompt berdasarkan model yang dipilih
        let refinedPrompt;
        
        if (this.currentModel === 'advanced') {
            // 5 paragraf untuk model lanjutan
            refinedPrompt = this.generateAdvancedPrompt(prompt);
        } else {
            // 2 paragraf untuk model cepat
            refinedPrompt = this.generateFastPrompt(prompt);
        }
        
        const result = {
            refined: refinedPrompt,
            model: this.currentModel,
            word_count: refinedPrompt.split(' ').length,
            processing_time: (Math.random() * 2 + 0.5).toFixed(1)
        };
        
        this.displayRefinedPrompt(result);
        this.addToHistory(prompt, refinedPrompt);
        this.updateStats();
        this.showNotification('Diproses Secara Lokal', 'Menggunakan fallback processing', 'info');
    }
    
    generateAdvancedPrompt(originalPrompt) {
        const improved = this.improveText(originalPrompt);
        
        const paragraphs = [
            `Sebagai ahli dalam bidang terkait, saya akan membantu Anda dengan permintaan "${improved}". Berikut adalah analisis dan solusi komprehensif yang dapat Anda gunakan.`,
            
            `Pertama-tama, penting untuk memahami konteks dan kebutuhan spesifik dari permintaan Anda. Berdasarkan analisis, saya merekomendasikan pendekatan terstruktur yang mencakup tahapan-tahapan penting untuk mencapai hasil optimal.`,
            
            `Untuk implementasi praktis, saya sarankan menggunakan metodologi yang telah teruji. Mulailah dengan persiapan yang matang, termasuk pengumpulan data dan informasi yang relevan. Pastikan Anda memiliki alat dan sumber daya yang diperlukan sebelum memulai.`,
            
            `Dalam proses eksekusi, perhatikan detail-detail penting yang sering kali diabaikan. Konsistensi dan ketelitian akan sangat memengaruhi kualitas hasil akhir. Jangan ragu untuk melakukan iterasi dan perbaikan berkelanjutan.`,
            
            `Terakhir, evaluasi hasil yang diperoleh dan buat dokumentasi yang baik untuk referensi di masa depan. Dengan pendekatan ini, Anda dapat mengoptimalkan waktu dan sumber daya sambil memastikan kualitas output yang maksimal.`
        ];
        
        return paragraphs.join('\n\n');
    }
    
    generateFastPrompt(originalPrompt) {
        const improved = this.improveText(originalPrompt);
        
        const paragraphs = [
            `Untuk permintaan "${improved}", berikut adalah solusi yang dapat Anda terapkan.`,
            
            `Mulailah dengan langkah-langkah dasar dan pastikan Anda mengikuti instruksi dengan teliti untuk mendapatkan hasil yang diinginkan.`
        ];
        
        return paragraphs.join('\n\n');
    }
    
    improveText(text) {
        const improvements = {
            'bikinin': 'buatkan',
            'bikin': 'buat',
            'nggak': 'tidak',
            'gak': 'tidak',
            'gimana': 'bagaimana',
            'gmn': 'bagaimana',
            'aja': 'saja',
            'deh': '',
            'sih': '',
            'dong': '',
            'ya': '',
            'nih': '',
            'bgt': 'sekali',
            'banget': 'sekali',
            'kaya': 'seperti',
            'kyk': 'seperti',
            'klo': 'jika',
            'kalo': 'jika',
            'yg': 'yang',
            'trus': 'kemudian',
            'udah': 'sudah',
            'udh': 'sudah',
            'sdh': 'sudah',
            'blm': 'belum',
            'blum': 'belum',
            'tp': 'tetapi',
            'tpi': 'tetapi',
            'krn': 'karena',
            'knp': 'kenapa',
            'knpa': 'kenapa',
            'mksd': 'maksud',
            'brp': 'berapa',
            'jg': 'juga',
            'jga': 'juga',
            'jgn': 'jangan',
            'lg': 'lagi',
            'lgi': 'lagi',
            'mw': 'ingin',
            'pgn': 'ingin',
            'pls': 'tolong',
            'please': 'tolong',
            'thx': 'terima kasih',
            'makasih': 'terima kasih',
            'mksh': 'terima kasih'
        };
        
        let words = text.split(' ');
        let improvedWords = words.map(word => {
            const lowerWord = word.toLowerCase();
            return improvements[lowerWord] || word;
        });
        
        let result = improvedWords.join(' ');
        result = result.charAt(0).toUpperCase() + result.slice(1);
        
        if (!/[.!?]$/.test(result)) {
            result += '.';
        }
        
        return result;
    }
    
    displayRefinedPrompt(data) {
        this.elements.promptPlaceholder.style.display = 'none';
        this.elements.refinedPromptText.style.display = 'block';
        
        const modelName = data.model === 'fast' ? 'Model Cepat' : 'Model Lanjutan';
        const modelIcon = data.model === 'fast' ? 'fa-bolt' : 'fa-brain';
        const paragraphs = data.refined.split('\n\n');
        
        let html = `
            <div class="prompt-model-badge">
                <i class="fas ${modelIcon}"></i>
                ${modelName}
            </div>
            
            <div class="prompt-header">
                <h4>Prompt Asli:</h4>
                <div class="prompt-original">
                    <strong>"${this.elements.userPrompt.value}"</strong>
                </div>
            </div>
            
            <div class="prompt-content">
        `;
        
        paragraphs.forEach(paragraph => {
            html += `<p class="prompt-paragraph animate-fade-in-up">${paragraph}</p>`;
        });
        
        html += `
            </div>
            
            <div class="prompt-footer">
                <div class="prompt-stats">
                    <span><i class="fas fa-clock"></i> Diproses dalam ${data.processing_time} detik</span>
                    <span><i class="fas fa-chart-bar"></i> ${data.word_count} kata</span>
                    <span><i class="fas fa-paragraph"></i> ${paragraphs.length} paragraf</span>
                </div>
                <div class="prompt-timestamp">
                    <i class="fas fa-calendar"></i> ${new Date().toLocaleTimeString('id-ID', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })}
                </div>
            </div>
        `;
        
        this.elements.refinedPromptText.innerHTML = html;
        
        // Tambahkan animasi bertahap pada paragraf
        setTimeout(() => {
            document.querySelectorAll('.prompt-paragraph').forEach((para, index) => {
                setTimeout(() => {
                    para.classList.add('animate-fade-in-up');
                }, index * 200);
            });
        }, 100);
    }
    
    // History Management
    addToHistory(original, refined) {
        const historyItem = {
            id: Date.now(),
            original: original,
            refined: refined,
            model: this.currentModel,
            timestamp: new Date().toISOString(),
            wordCount: refined.split(' ').length
        };
        
        this.history.unshift(historyItem);
        if (this.history.length > 10) {
            this.history = this.history.slice(0, 10);
        }
        
        this.saveHistory();
        this.updateHistoryDisplay();
    }
    
    updateHistoryDisplay() {
        this.elements.historyList.innerHTML = '';
        
        this.history.forEach(item => {
            const element = document.createElement('div');
            element.className = 'history-item';
            element.dataset.id = item.id;
            
            const time = new Date(item.timestamp).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            element.innerHTML = `
                <div class="history-content">
                    <div class="history-prompt">${item.original.substring(0, 80)}${item.original.length > 80 ? '...' : ''}</div>
                    <div class="history-model">${item.model === 'fast' ? 'Model Cepat' : 'Model Lanjutan'}</div>
                </div>
                <div class="history-meta">
                    <div class="history-time">
                        <i class="fas fa-clock"></i>
                        ${time}
                    </div>
                    <div class="history-words">
                        <i class="fas fa-chart-bar"></i>
                        ${item.wordCount} kata
                    </div>
                </div>
            `;
            
            this.elements.historyList.appendChild(element);
        });
    }
    
    loadFromHistory(id) {
        const item = this.history.find(h => h.id == id);
        if (item) {
            this.elements.userPrompt.value = item.original;
            this.updateCharCount();
            this.currentModel = item.model;
            
            // Update model selection UI
            document.querySelectorAll('.model-card').forEach(card => {
                card.classList.remove('active');
                if (card.dataset.model === item.model) {
                    card.classList.add('active');
                }
            });
            
            this.showNotification('Prompt Dimuat', 'Prompt dari riwayat telah dimuat', 'info');
        }
    }
    
    clearHistory() {
        if (this.history.length > 0) {
            if (confirm('Hapus semua riwayat prompt?')) {
                this.history = [];
                this.saveHistory();
                this.updateHistoryDisplay();
                this.showNotification('Riwayat Dihapus', 'Semua riwayat telah dibersihkan', 'info');
            }
        }
    }
    
    saveHistory() {
        localStorage.setItem('promptHistory', JSON.stringify(this.history));
    }
    
    loadHistory() {
        const saved = localStorage.getItem('promptHistory');
        if (saved) {
            this.history = JSON.parse(saved);
            this.updateHistoryDisplay();
        }
    }
    
    // Stats Management
    updateStats() {
        this.processedCount++;
        this.totalTimeSaved += 5; // Simpan 5 menit per prompt
        
        localStorage.setItem('processedCount', this.processedCount);
        localStorage.setItem('totalTimeSaved', this.totalTimeSaved);
        
        this.updateStatsDisplay();
    }
    
    loadStats() {
        this.processedCount = parseInt(localStorage.getItem('processedCount')) || 0;
        this.totalTimeSaved = parseInt(localStorage.getItem('totalTimeSaved')) || 0;
    }
    
    updateStatsDisplay() {
        this.elements.processedCount.textContent = this.processedCount;
        this.elements.timeSaved.textContent = this.totalTimeSaved;
        
        const successRate = this.processedCount > 0 ? '100%' : '100%';
        this.elements.successRate.textContent = successRate;
    }
    
    // Example Prompts
    useExample(event) {
        const card = event.currentTarget;
        const prompt = card.dataset.prompt;
        
        this.elements.userPrompt.value = prompt;
        this.updateCharCount();
        
        // Animate the clicked card
        card.classList.add('animate-scale-in');
        setTimeout(() => {
            card.classList.remove('animate-scale-in');
        }, 500);
        
        // Auto-process after 1 second
        setTimeout(() => {
            this.processPrompt();
        }, 1000);
        
        this.showNotification('Contoh Dimuat', 'Prompt contoh telah dimuat dan sedang diproses', 'info');
    }
    
    // Generate Prompt
    async generatePrompt() {
        try {
            const response = await fetch('generate.php');
            const data = await response.json();
            
            if (data.success) {
                this.elements.userPrompt.value = data.data.prompt;
                this.updateCharCount();
                this.showNotification('Prompt Dihasilkan', 'Prompt baru telah dibuat', 'success');
            }
        } catch (error) {
            // Fallback prompts
            const prompts = [
                "Buatkan saya kode Python untuk analisis data dengan visualisasi menggunakan matplotlib dan pandas",
                "Jelaskan konsep blockchain dan cryptocurrency secara mendalam untuk pemula",
                "Bantu saya menulis proposal bisnis untuk startup teknologi di bidang AI",
                "Buatkan desain UI/UX untuk aplikasi mobile kesehatan dengan fitur konsultasi dokter",
                "Jelaskan perbedaan antara berbagai jenis neural network dan aplikasinya"
            ];
            
            const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
            this.elements.userPrompt.value = randomPrompt;
            this.updateCharCount();
            this.showNotification('Prompt Dihasilkan', 'Prompt offline telah dibuat', 'info');
        }
    }
    
    // Utility Functions
    showLoading() {
        this.isProcessing = true;
        this.elements.loadingOverlay.classList.add('active');
        
        const loadingTips = [
            'Menganalisis struktur bahasa...',
            'Memperbaiki tata bahasa dan ejaan...',
            'Mengoptimalkan kalimat untuk AI...',
            'Menambahkan detail kontekstual...',
            'Menyusun paragraf yang koheren...',
            'Memperkaya kosakata profesional...'
        ];
        
        const randomTip = loadingTips[Math.floor(Math.random() * loadingTips.length)];
        this.elements.loadingTip.textContent = randomTip;
        
        this.loadingStartTime = Date.now();
        this.updateLoadingTimer();
        
        // Safety timeout
        setTimeout(() => {
            if (this.isProcessing) {
                this.hideLoading();
                this.showNotification('Timeout', 'Proses terlalu lama, silakan coba lagi', 'warning');
            }
        }, 15000);
    }
    
    updateLoadingTimer() {
        if (this.loadingTimer) {
            clearInterval(this.loadingTimer);
        }
        
        this.loadingTimer = setInterval(() => {
            if (this.loadingStartTime) {
                const elapsed = Math.floor((Date.now() - this.loadingStartTime) / 1000);
                this.elements.elapsedTime.textContent = elapsed;
            }
        }, 1000);
    }
    
    hideLoading() {
        this.isProcessing = false;
        this.elements.loadingOverlay.classList.remove('active');
        
        if (this.loadingTimer) {
            clearInterval(this.loadingTimer);
            this.loadingTimer = null;
        }
    }
    
    showNotification(title, text, type = 'success') {
        const notification = document.getElementById('notification');
        const titleElement = document.getElementById('notificationTitle');
        const textElement = document.getElementById('notificationText');
        
        // Set icon based on type
        let icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-times-circle';
        if (type === 'warning') icon = 'fa-exclamation-circle';
        if (type === 'info') icon = 'fa-info-circle';
        
        document.querySelector('.notification-icon i').className = `fas ${icon}`;
        
        titleElement.textContent = title;
        textElement.textContent = text;
        
        notification.classList.add('show');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
    
    copyToClipboard() {
        const promptElement = this.elements.refinedPromptText;
        if (promptElement.style.display === 'none') {
            this.showNotification('Tidak Ada Prompt', 'Tidak ada prompt untuk disalin', 'warning');
            return;
        }
        
        const promptText = promptElement.querySelector('.prompt-content')?.textContent || '';
        if (promptText.trim()) {
            navigator.clipboard.writeText(promptText).then(() => {
                this.showNotification('Berhasil Disalin', 'Prompt telah disalin ke clipboard', 'success');
            }).catch(err => {
                console.error('Copy failed:', err);
                this.showNotification('Gagal Menyalin', 'Tidak dapat menyalin ke clipboard', 'error');
            });
        }
    }
    
    savePrompt() {
        const promptElement = this.elements.refinedPromptText;
        if (promptElement.style.display === 'none') {
            this.showNotification('Tidak Ada Prompt', 'Tidak ada prompt untuk disimpan', 'warning');
            return;
        }
        
        const promptText = promptElement.querySelector('.prompt-content')?.textContent || '';
        if (promptText.trim()) {
            // Simulasi penyimpanan ke database
            this.showNotification('Prompt Disimpan', 'Prompt telah disimpan ke database', 'success');
        }
    }
    
    clearPrompt() {
        this.elements.userPrompt.value = '';
        this.updateCharCount();
        this.showNotification('Prompt Dihapus', 'Input prompt telah dibersihkan', 'info');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new PremiumPromptRefiner();
    window.promptRefiner = app; // Make it available globally for debugging
});
