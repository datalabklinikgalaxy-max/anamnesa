// ====================================================================
// URL APPS SCRIPT
// ====================================================================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwwS5GtkCaffEV1p-VwHCs2Wh7aOr-UFGNi7OOB61esfTrPnuvVMr7a8uVi8-mUHorqtg/exec'; 

const form = document.getElementById('anamnesaForm');
const pesanStatus = document.getElementById('pesanStatus');


// ========================================================
// 1. CONDITIONAL DISPLAY — KELUHAN SEKARANG
// ========================================================
const keluhanAda = document.getElementById('keluhan_ada');
const keluhanTidak = document.getElementById('keluhan_tidak');
const keluhanContainer = document.getElementById('keluhan_sebutkan_container');
const keluhanInput = document.getElementById('keluhan_sebutkan_input');

function toggleKeluhanField() {
    if (keluhanAda.checked) {
        keluhanContainer.style.display = 'block';
        keluhanInput.required = true;
    } else {
        keluhanContainer.style.display = 'none';
        keluhanInput.value = '';
        keluhanInput.required = false;
    }
}

keluhanAda.addEventListener('change', toggleKeluhanField);
keluhanTidak.addEventListener('change', toggleKeluhanField);
toggleKeluhanField();


// ========================================================
// 2. CONDITIONAL DISPLAY — PENYAKIT KELUARGA LAINNYA
// ========================================================
const radioYa = document.getElementById('kel_lainnya_ya');
const radioTidak = document.getElementById('kel_lainnya_tidak');
const sebutkanContainer = document.getElementById('sebutkan_lainnya_container');
const sebutkanInput = document.getElementById('kel_lainnya_sebutkan_input');

function toggleSebutkanField() {
    if (radioYa.checked) {
        sebutkanContainer.style.display = 'block';
        sebutkanInput.required = true;
    } else {
        sebutkanContainer.style.display = 'none';
        sebutkanInput.value = '';
        sebutkanInput.required = false;
    }
}

radioYa.addEventListener('change', toggleSebutkanField);
radioTidak.addEventListener('change', toggleSebutkanField);
toggleSebutkanField();


// ========================================================
// 3. CONDITIONAL DISPLAY — KEBIASAAN (ALKOHOL, ROKOK)
// ========================================================
function setupConditionalInput(radioYesId, radioNoId, textInputSelector) {
    const yes = document.getElementById(radioYesId);
    const no = document.getElementById(radioNoId);
    const input = document.querySelector(textInputSelector);

    function toggle() {
        if (yes.checked) {
            input.style.display = 'inline-block';
            input.required = true;
        } else {
            input.style.display = 'none';
            input.value = '';
            input.required = false;
        }
    }

    yes.addEventListener('change', toggle);
    no.addEventListener('change', toggle);
    toggle();
}

// Alkohol
setupConditionalInput("alk_ya", "alk_tidak", "input[name='jumlah_alkohol']");

// Merokok
setupConditionalInput("rokok_ya", "rokok_tidak", "input[name='jumlah_rokok']");


// ========================================================
// 3B. CONDITIONAL DISPLAY — OLAHRAGA (frekuensi + jenis)
// ========================================================
const olYa = document.getElementById("ol_ya");
const olTidak = document.getElementById("ol_tidak");
const freqInput = document.querySelector("input[name='frekuensi_olahraga']");
const jenisContainer = document.createElement("div");

// Buat container jenis olahraga
jenisContainer.id = "jenis_olahraga_container";
jenisContainer.style.display = "none";
jenisContainer.innerHTML = `
    <label>Jenis Olahraga yang dilakukan:</label>
    <input type="text" name="jenis_olahraga" id="jenis_olahraga_input">
`;

// Sisipkan setelah frekuensi olahraga
freqInput.parentElement.insertAdjacentElement("afterend", jenisContainer);

const jenisInput = document.getElementById("jenis_olahraga_input");

function toggleOlahraga() {
    if (olYa.checked) {
        // tampilkan frekuensi
        freqInput.style.display = 'inline-block';
        freqInput.required = true;

        // tampilkan jenis olahraga
        jenisContainer.style.display = 'block';
        jenisInput.required = true;

    } else {
        // sembunyikan frekuensi
        freqInput.style.display = 'none';
        freqInput.value = '';
        freqInput.required = false;

        // sembunyikan jenis olahraga
        jenisContainer.style.display = 'none';
        jenisInput.value = '';
        jenisInput.required = false;
    }
}

olYa.addEventListener("change", toggleOlahraga);
olTidak.addEventListener("change", toggleOlahraga);
toggleOlahraga();


// ========================================================
// 4. SUBMIT FORM KE GOOGLE SHEETS
// ========================================================
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

                // Reset semua conditional field
                toggleKeluhanField();
                toggleSebutkanField();
                toggleOlahraga();
                setupConditionalInput("alk_ya", "alk_tidak", "input[name='jumlah_alkohol']");
                setupConditionalInput("rokok_ya", "rokok_tidak", "input[name='jumlah_rokok']");

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

