document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const messageElement = document.getElementById('message');
    const loginButton = form.querySelector('.login-button'); 

    // !!! PENTING: GANTI DENGAN URL DEPLOYMENT UNTUK doPostLogin ANDA !!!
    const LOGIN_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwwS5GtkCaffEV1p-VwHCs2Wh7aOr-UFGNi7OOB61esfTrPnuvVMr7a8uVi8-mUHorqtg/exec'; 
    // ----------------------------------------------------------------

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        // Validasi Input
        if (username === '' || password === '') {
            showMessage('Masukkan Username dan Password!', 'error');
            return;
        }

        // Loading State
        loginButton.disabled = true;
        loginButton.textContent = '⏳ Verifying...'; 
        
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        try {
            // Kirim Data ke Google Apps Script (POST request)
            const response = await fetch(LOGIN_SCRIPT_URL, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                 // Menangani error koneksi HTTP
                 throw new Error(`Koneksi gagal. Status: ${response.status}`);
            }
            
            const result = await response.json();

            // Cek Hasil Respon dari Apps Script
            if (result && result.result === 'success') {
                showMessage(`✅ Login berhasil! Selamat datang, ${result.username}. Mengarahkan...`, 'success');
                // Alihkan ke halaman formulir utama (index.html)
                setTimeout(() => {
                    window.location.href = 'index.html'; 
                }, 1500); 

            } else if (result && result.result === 'failure') {
                 // Menangani kegagalan login (Username/Password salah)
                 showMessage('❌ Username atau Password salah. Coba lagi.', 'error');
            } else {
                throw new Error('Respon Apps Script tidak valid.');
            }

        } catch (error) {
            console.error('Login Error:', error);
            // Ini akan menampilkan pesan 'Terjadi kesalahan server yang tidak terduga.'
            showMessage('❌ Terjadi kesalahan server yang tidak terduga.', 'error'); 
        } finally {
            // Kembalikan Tombol ke Keadaan Semula
            loginButton.disabled = false;
            loginButton.textContent = 'Log In'; 
        }
    });

    /**
     * Fungsi untuk menampilkan pesan status (sukses/error)
     */
    function showMessage(msg, type) {
        messageElement.textContent = msg;
        messageElement.className = 'message-status'; // Reset class
        messageElement.style.display = 'block';

        if (type === 'success') {
            messageElement.classList.add('success'); 
        } else if (type === 'error') {
            messageElement.classList.add('error');
        }
        
        // Sembunyikan pesan setelah 5 detik
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
});