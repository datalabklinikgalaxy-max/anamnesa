// ====================================================================
// !!! KRUSIAL: GANTI URL INI DENGAN URL DEPLOYMENT UNTUK doPost ANAMNESA ANDA !!!
// ====================================================================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwwS5GtkCaffEV1p-VwHCs2Wh7aOr-UFGNi7OOB61esfTrPnuvVMr7a8uVi8-mUHorqtg/exec'; 

const form = document.getElementById('anamnesaForm');
const pesanStatus = document.getElementById('pesanStatus');

// --- Logika Conditional Display 1: Keluhan Sekarang ---
const keluhanAda = document.getElementById('keluhan_ada');
const keluhanTidak = document.getElementById('keluhan_tidak');
const keluhanContainer = document.getElementById('keluhan_sebutkan_container');
const keluhanInput = document.getElementById('keluhan_sebutkan_input');

function toggleKeluhanField() {
    if (keluhanAda && keluhanAda.checked) {
        keluhanContainer.style.display = 'block';
        keluhanInput.setAttribute('required', 'required'); // Wajib diisi jika 'Ada'
    } else {
        keluhanContainer.style.display = 'none';
        keluhanInput.value = ''; 
        keluhanInput.removeAttribute('required');
    }
}

if (keluhanAda && keluhanTidak) {
    keluhanAda.addEventListener('change', toggleKeluhanField);
    keluhanTidak.addEventListener('change', toggleKeluhanField);
    toggleKeluhanField(); // Panggil saat load
}

// --- Logika Conditional Display 2: Penyakit Keluarga Lainnya ---
const radioYa = document.getElementById('kel_lainnya_ya');
const radioTidak = document.getElementById('kel_lainnya_tidak');
const sebutkanContainer = document.getElementById('sebutkan_lainnya_container');
const sebutkanInput = document.getElementById('kel_lainnya_sebutkan_input');


function toggleSebutkanField() {
    if (radioYa && radioYa.checked) {
        sebutkanContainer.style.display = 'block';
        sebutkanInput.setAttribute('required', 'required'); // Wajib diisi jika 'Ya'
    } else {
        sebutkanContainer.style.display = 'none';
        sebutkanInput.value = ''; 
        sebutkanInput.removeAttribute('required');
    }
}

if (radioYa && radioTidak) {
    radioYa.addEventListener('change', toggleSebutkanField);
    radioTidak.addEventListener('change', toggleSebutkanField);
    toggleSebutkanField(); // Panggil saat load
}
// --- Akhir Logika Conditional Display ---


// Listener untuk event submit form
if (form) {
    form.addEventListener('submit', function(e) {
      
      e.preventDefault(); 
      
      pesanStatus.textContent = 'Mengirim data... Mohon tunggu.';
      pesanStatus.style.color = 'blue';

      const formData = new FormData(form);
      
      fetch(SCRIPT_URL, {
        method: 'POST', 
        body: formData 
      })
      .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
        
        if (data.result === 'success') {
          pesanStatus.textContent = '✅ Data anamnesa berhasil tersimpan di Google Sheet!';
          pesanStatus.style.color = 'green';
          form.reset(); 
          // Penting: Panggil lagi setelah reset form agar field "Sebutkan" kembali tersembunyi
          toggleKeluhanField();
          toggleSebutkanField();
        } else {
          throw new Error(data.message || 'Gagal menyimpan data ke Apps Script.');
        }
      })
      .catch(error => {
        console.error('Error saat mengirim:', error);
        pesanStatus.textContent = `❌ Gagal menyimpan data: ${error.message}.`;
        pesanStatus.style.color = 'red';
      });
    });
}