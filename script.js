document.addEventListener('DOMContentLoaded', () => {
    // --- Initial Data Loading ---
    let users = JSON.parse(localStorage.getItem('absensiUsers')) || [
        { nis: 'admin', password: 'admin123', name: 'Administrator', rfid_id: 'ADMINRFID', isAdmin: true, nilai: [] }
    ];
    let attendance = JSON.parse(localStorage.getItem('absensiAttendance')) || [];
    let settings = JSON.parse(localStorage.getItem('absensiSettings')) || {
        idealMasuk: '08:00',
        idealPulang: '16:00'
    };

    let currentUser = null; // Stores the currently logged-in user object

    // --- DOM Elements ---
    const authSection = document.getElementById('authSection');
    const appSection = document.getElementById('appSection');
    const authHeading = document.getElementById('authHeading');

    const loginForm = document.getElementById('loginForm');
    const loginNISInput = document.getElementById('loginNIS');
    const loginPasswordInput = document.getElementById('loginPassword');
    const showRegisterLink = document.getElementById('showRegister');

    const registerForm = document.getElementById('registerForm');
    const registerNameInput = document.getElementById('registerName');
    const registerNISInput = document.getElementById('registerNIS');
    const registerRFIDInput = document.getElementById('registerRFID');
    const registerPasswordInput = document.getElementById('registerPassword');
    const showLoginLink = document.getElementById('showLogin');

    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminUsernameInput = document.getElementById('adminUsername');
    const adminPasswordInput = document.getElementById('adminPassword');
    const showAdminLoginLink = document.getElementById('showAdminLogin');
    const showStudentLoginLink = document.getElementById('showStudentLogin');

    const loggedInUserName = document.getElementById('loggedInUserName');
    const logoutBtn = document.getElementById('logoutBtn');

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Dashboard Elements
    const tabDashboard = document.getElementById('tabDashboard');
    const dashboardTotalStudents = document.getElementById('dashboardTotalStudents');
    const dashboardStudentsPresent = document.getElementById('dashboardStudentsPresent');
    const dashboardStudentsAbsent = document.getElementById('dashboardStudentsAbsent');
    const dashboardTodayAttendanceTableBody = document.querySelector('#dashboardTodayAttendanceTable tbody');
    const noTodayAttendance = document.getElementById('noTodayAttendance');

    // Absensi (Student/Admin) Elements
    const tabAbsensi = document.getElementById('tabAbsensi');
    const simulateScanBtn = document.getElementById('simulateScanBtn');
    const scanFeedback = document.getElementById('scanFeedback'); // Dipindahkan ke authSection di HTML
    const masukTimeSpan = document.getElementById('masukTime');
    const pulangTimeSpan = document.getElementById('pulangTime');

    // Nilai Siswa Elements
    const tabNilai = document.getElementById('tabNilai');
    const nilaiFormSection = document.getElementById('nilaiFormSection');
    const nilaiSiswaSelect = document.getElementById('nilaiSiswaSelect');
    const nilaiForm = document.getElementById('nilaiForm');
    const mataPelajaranInput = document.getElementById('mataPelajaran');
    const nilaiAngkaInput = document.getElementById('nilaiAngka');
    const keteranganNilaiInput = document.getElementById('keteranganNilai');
    const nilaiIdToEditInput = document.getElementById('nilaiIdToEdit');
    const cancelEditNilaiBtn = document.getElementById('cancelEditNilaiBtn');
    const nilaiTableBody = document.querySelector('#nilaiTable tbody');
    const noNilaiData = document.getElementById('noNilaiData');
    const nilaiTableStudentHeader = document.getElementById('nilaiTableStudentHeader');
    const nilaiTableActionsHeader = document.getElementById('nilaiTableActionsHeader');

    // Riwayat Absensi (Admin) Elements
    const tabRiwayat = document.getElementById('tabRiwayat');
    const riwayatAbsensiTableBody = document.querySelector('#riwayatAbsensiTable tbody');
    const noRiwayatData = document.getElementById('noRiwayatData');
    const filterDateInput = document.getElementById('filterDate');
    const filterNISInput = document.getElementById('filterNIS');
    const resetFilterBtn = document.getElementById('resetFilterBtn');

    // Manajemen Siswa (Admin) Elements
    const tabManajemen = document.getElementById('tabManajemen');
    const manajemenSiswaTableBody = document.querySelector('#manajemenSiswaTable tbody');
    const noManajemenData = document.getElementById('noManajemenData');

    // Absen Manual (Admin) Elements
    const tabManualAbsen = document.getElementById('tabManualAbsen');
    const manualAbsenForm = document.getElementById('manualAbsenForm');
    const manualNISSelect = document.getElementById('manualNIS');
    const manualStatusSelect = document.getElementById('manualStatus');

    // Rekap Absensi (Admin) Elements
    const tabRekap = document.getElementById('tabRekap');
    const rekapStartDateInput = document.getElementById('rekapStartDate');
    const rekapEndDateInput = document.getElementById('rekapEndDate');
    const generateRekapBtn = document.getElementById('generateRekapBtn');
    const rekapAbsensiTableBody = document.querySelector('#rekapAbsensiTable tbody');
    const noRekapData = document.getElementById('noRekapData');

    // Pengaturan (Admin) Elements
    const tabPengaturan = document.getElementById('tabPengaturan');
    const workingHoursForm = document.getElementById('workingHoursForm');
    const idealMasukTimeInput = document.getElementById('idealMasukTime');
    const idealPulangTimeInput = document.getElementById('idealPulangTime');
    const workingHoursFeedback = document.getElementById('workingHoursFeedback');

    // Modal Elements for Detail attendance
    const detailModal = document.getElementById('detailModal');
    const closeDetailModalBtn = document.getElementById('closeDetailModal');
    const modalStudentName = document.getElementById('modalStudentName');
    const modalStudentNIS = document.getElementById('modalStudentNIS');
    const modalAttendanceTableBody = document.querySelector('#modalAttendanceTable tbody');
    const noDetailData = document.getElementById('noDetailData');

    // Modal for Edit Student Data
    const editStudentModal = document.getElementById('editStudentModal');
    const closeEditStudentModalBtn = document.getElementById('closeEditStudentModal');
    const editStudentForm = document.getElementById('editStudentForm');
    const editStudentOriginalNISInput = document.getElementById('editStudentOriginalNIS');
    const editStudentNameInput = document.getElementById('editStudentName');
    const editStudentNISInput = document.getElementById('editStudentNIS');
    const editStudentRFIDInput = document.getElementById('editStudentRFID');
    const editStudentPasswordInput = document.getElementById('editStudentPassword');

    // Modal for View Account Detail
    const viewAccountModal = document.getElementById('viewAccountModal');
    const closeViewAccountModalBtn = document.getElementById('closeViewAccountModal');
    const viewAccountNameSpan = document.getElementById('viewAccountName');
    const viewAccountNISSpan = document.getElementById('viewAccountNIS');
    const viewAccountRFIDSpan = document.getElementById('viewAccountRFID');
    const viewAccountPasswordSpan = document.getElementById('viewAccountPassword');
    const viewAccountIsAdminSpan = document.getElementById('viewAccountIsAdmin');


    // --- Helper Functions ---
    function saveUsers() {
        localStorage.setItem('absensiUsers', JSON.stringify(users));
    }

    function saveAttendance() {
        localStorage.setItem('absensiAttendance', JSON.stringify(attendance));
    }

    function saveSettings() {
        localStorage.setItem('absensiSettings', JSON.stringify(settings));
    }

    function generateRFID() {
        const chars = '0123456789ABCDEF';
        let rfid = '';
        for (let i = 0; i < 10; i++) {
            rfid += chars[Math.floor(Math.random() * chars.length)];
        }
        return rfid;
    }

    function getTodayDateString() {
        return new Date().toISOString().split('T')[0];
    }

    function hideAllForms() {
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        adminLoginForm.style.display = 'none';
    }

    function showFeedback(element, message, type) {
        element.textContent = message;
        element.className = `feedback-message ${type}`;
        element.style.display = 'block';
        // Clear previous timeouts to prevent message overlap
        clearTimeout(element.feedbackTimeout);
        element.feedbackTimeout = setTimeout(() => {
            element.style.display = 'none';
            element.textContent = '';
        }, 3000); // Hide after 3 seconds
    }

    // PENTING: Fungsi openTab harus ada di scope global atau di dalam DOMContentLoaded
    // agar bisa diakses oleh onclick="" di HTML
    window.openTab = function(tabId) { // Menggunakan window.openTab agar eksplisit global
        tabContents.forEach(content => content.classList.remove('active'));
        tabButtons.forEach(button => button.classList.remove('active'));

        document.getElementById(tabId).classList.add('active');
        const correspondingTabButton = document.getElementById(`tab${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
        if (correspondingTabButton) {
            correspondingTabButton.classList.add('active');
        }

        // Load data specific to tab
        if (tabId === 'dashboard') {
            renderDashboard();
        } else if (tabId === 'riwayat') {
            renderAttendanceHistory();
        } else if (tabId === 'manajemen') {
            renderManagementTable();
        } else if (tabId === 'manualAbsen') {
            populateManualAbsenSelect();
        } else if (tabId === 'absensi') {
            renderTodayAttendanceStatus();
        } else if (tabId === 'rekap') {
            rekapAbsensiTableBody.innerHTML = ''; // Clear previous rekap data
            noRekapData.style.display = 'block';
            noRekapData.textContent = 'Pilih rentang tanggal dan generate rekap.'; // Reset message
        } else if (tabId === 'pengaturan') {
            loadWorkingHoursSettings();
        } else if (tabId === 'nilai') { // Handle Nilai tab
            renderNilaiTable();
        }
    };


    function updateAppVisibility() {
        if (currentUser) {
            authSection.style.display = 'none';
            appSection.style.display = 'block';
            loggedInUserName.textContent = currentUser.name;
            updateTabVisibility();

            if (currentUser.isAdmin) {
                openTab('dashboard'); // Admin default to dashboard
            } else {
                openTab('absensi'); // Student default to absensi
            }
        } else {
            authSection.style.display = 'block';
            appSection.style.display = 'none';
            authHeading.textContent = 'Login Siswa';
            hideAllForms();
            loginForm.style.display = 'block';
            // Clear any lingering feedback
            scanFeedback.style.display = 'none';
            scanFeedback.textContent = '';
        }
    }

    function updateTabVisibility() {
        // Hide all tabs by default
        tabDashboard.style.display = 'none';
        tabAbsensi.style.display = 'none';
        tabNilai.style.display = 'none';
        tabRiwayat.style.display = 'none';
        tabManajemen.style.display = 'none';
        tabManualAbsen.style.display = 'none';
        tabRekap.style.display = 'none';
        tabPengaturan.style.display = 'none';

        if (currentUser) {
            if (currentUser.isAdmin) {
                // Admin sees all tabs
                tabDashboard.style.display = 'block';
                tabAbsensi.style.display = 'block';
                tabNilai.style.display = 'block';
                tabRiwayat.style.display = 'block';
                tabManajemen.style.display = 'block';
                tabManualAbsen.style.display = 'block';
                tabRekap.style.display = 'block';
                tabPengaturan.style.display = 'block';
                tabAbsensi.textContent = "Absensi (Admin)"; // Clarify for admin
                tabNilai.textContent = "Nilai (Admin)"; // Clarify for admin
            } else {
                // Student only sees Absensi and Nilai
                tabAbsensi.style.display = 'block';
                tabNilai.style.display = 'block';
                tabAbsensi.textContent = "Absen Saya"; // Clarify for student
                tabNilai.textContent = "Nilai Saya"; // Clarify for student
            }
        }
    }

    // --- Authentication Logic ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nis = loginNISInput.value.trim();
        const password = loginPasswordInput.value.trim();

        const user = users.find(u => u.nis === nis && u.password === password);

        if (user) {
            currentUser = user;
            updateAppVisibility();
            showFeedback(scanFeedback, `Selamat datang, ${currentUser.name}!`, 'success');
        } else {
            showFeedback(scanFeedback, 'NIS atau Password salah!', 'error');
        }
        loginForm.reset();
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = registerNameInput.value.trim();
        const nis = registerNISInput.value.trim();
        const rfid_id = registerRFIDInput.value.trim();
        const password = registerPasswordInput.value.trim();

        if (users.some(u => u.nis === nis)) {
            showFeedback(scanFeedback, 'NIS ini sudah terdaftar!', 'error');
            return;
        }
        // Regenerate RFID if already exists, only for non-admin RFIDs
        if (users.some(u => u.rfid_id === rfid_id && rfid_id !== 'ADMINRFID')) {
             showFeedback(scanFeedback, 'ID RFID ini sudah terdaftar! Coba daftar lagi untuk generate ID baru.', 'error');
             registerRFIDInput.value = generateRFID(); // Regenerate RFID if already exists
             return;
        }

        const newUser = {
            nis: nis,
            password: password,
            name: name,
            rfid_id: rfid_id,
            isAdmin: false,
            nilai: [] // Initialize nilai array for new students
        };
        users.push(newUser);
        saveUsers();
        showFeedback(scanFeedback, 'Akun siswa berhasil didaftarkan! Silakan Login.', 'success');
        registerForm.reset();
        hideAllForms();
        authHeading.textContent = 'Login Siswa';
        loginForm.style.display = 'block';
    });

    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = adminUsernameInput.value.trim();
        const password = adminPasswordInput.value.trim();

        const adminUser = users.find(u => u.nis === username && u.password === password && u.isAdmin);

        if (adminUser) {
            currentUser = adminUser;
            updateAppVisibility();
            showFeedback(scanFeedback, `Selamat datang, Admin ${currentUser.name}!`, 'success');
        } else {
            showFeedback(scanFeedback, 'Username atau Password Admin salah!', 'error');
        }
        adminLoginForm.reset();
    });

    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        updateAppVisibility();
        showFeedback(scanFeedback, 'Anda telah logout.', 'success');
    });

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllForms();
        authHeading.textContent = 'Daftar Akun Siswa';
        registerForm.style.display = 'block';
        registerRFIDInput.value = generateRFID();
        scanFeedback.style.display = 'none'; // Clear feedback when switching forms
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllForms();
        authHeading.textContent = 'Login Siswa';
        loginForm.style.display = 'block';
        scanFeedback.style.display = 'none'; // Clear feedback when switching forms
    });

    showAdminLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllForms();
        authHeading.textContent = 'Login Admin';
        adminLoginForm.style.display = 'block';
        scanFeedback.style.display = 'none'; // Clear feedback when switching forms
    });

    showStudentLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllForms();
        authHeading.textContent = 'Login Siswa';
        loginForm.style.display = 'block';
        scanFeedback.style.display = 'none'; // Clear feedback when switching forms
    });


    // --- Absensi Logic (Student/RFID Simulation) ---
    simulateScanBtn.addEventListener('click', () => {
        if (!currentUser) {
            showFeedback(scanFeedback, 'Silakan login terlebih dahulu untuk melakukan absensi.', 'error');
            return;
        }

        let rfidToScan = currentUser.rfid_id;

        if (currentUser.isAdmin) {
             const studentUsers = users.filter(u => !u.isAdmin);
             if (studentUsers.length > 0) {
                 const randomStudent = studentUsers[Math.floor(Math.random() * studentUsers.length)];
                 rfidToScan = randomStudent.rfid_id;
                 showFeedback(scanFeedback, `Admin mensimulasikan scan RFID untuk ${randomStudent.name}.`, 'info');
             } else {
                 showFeedback(scanFeedback, 'Tidak ada siswa terdaftar untuk simulasi scan RFID oleh Admin.', 'error');
                 return;
             }
        }
        processRFIDScan(rfidToScan);
    });

    function processRFIDScan(rfid_id_scanned) {
        const user = users.find(u => u.rfid_id === rfid_id_scanned);

        if (!user) {
            showFeedback(scanFeedback, `ID RFID '${rfid_id_scanned}' tidak dikenali.`, 'error');
            return;
        }

        const today = getTodayDateString();
        const existingRecordsToday = attendance.filter(rec =>
            rec.nis === user.nis && new Date(rec.timestamp).toISOString().split('T')[0] === today
        );

        let statusToRecord = 'Masuk';
        let feedbackMsg = '';
        let feedbackType = '';

        if (existingRecordsToday.length === 0) {
            statusToRecord = 'Masuk';
            feedbackMsg = `Absensi Masuk untuk ${user.name} berhasil dicatat!`;
            feedbackType = 'success';
        } else {
            const lastRecord = existingRecordsToday.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
            if (lastRecord.status === 'Masuk') {
                statusToRecord = 'Pulang';
                feedbackMsg = `Absensi Pulang untuk ${user.name} berhasil dicatat!`;
                feedbackType = 'success';
            } else {
                feedbackMsg = `Absensi untuk ${user.name} sudah tercatat hari ini sebagai ${lastRecord.status}.`;
                feedbackType = 'error';
                showFeedback(scanFeedback, feedbackMsg, feedbackType);
                renderTodayAttendanceStatus();
                return;
            }
        }

        const newRecord = {
            id: Date.now(), // Unique ID for each attendance record
            nis: user.nis,
            name: user.name,
            rfid_id: rfid_id_scanned,
            timestamp: new Date().toISOString(),
            status: statusToRecord,
            source: 'RFID'
        };
        attendance.push(newRecord);
        saveAttendance();
        showFeedback(scanFeedback, feedbackMsg, feedbackType);
        renderTodayAttendanceStatus();
        // Update relevant admin views if admin is logged in
        if (currentUser && currentUser.isAdmin) {
             renderDashboard();
             renderAttendanceHistory();
        }
    }

    function renderTodayAttendanceStatus() {
        if (!currentUser) return; // Should not happen if this is only called when logged in

        const today = getTodayDateString();
        const studentNis = currentUser.nis;

        const todayRecords = attendance.filter(rec =>
            rec.nis === studentNis && new Date(rec.timestamp).toISOString().split('T')[0] === today
        ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        let masukTime = 'Belum tercatat';
        let pulangTime = 'Belum tercatat';

        todayRecords.forEach(record => {
            const time = new Date(record.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            if (record.status === 'Masuk') {
                masukTime = time;
            } else if (record.status === 'Pulang') {
                pulangTime = time;
            }
        });

        masukTimeSpan.textContent = masukTime;
        pulangTimeSpan.textContent = pulangTime;
    }


    // --- Nilai Siswa Logic (Student & Admin) ---
    function renderNilaiTable() {
        nilaiTableBody.innerHTML = '';
        nilaiIdToEditInput.value = ''; // Reset edit state
        cancelEditNilaiBtn.style.display = 'none';
        nilaiForm.reset();
        nilaiSiswaSelect.disabled = false; // Enable select when not editing

        let filteredNilai = [];
        let displayStudentColumn = false; // By default, hide student column for student view

        if (currentUser.isAdmin) {
            nilaiFormSection.style.display = 'block'; // Show form for admin
            nilaiTableStudentHeader.style.display = ''; // Show student column header
            nilaiTableActionsHeader.style.display = ''; // Show actions header
            // Populate select input for admin
            populateNilaiSiswaSelect();

            // Get all students' nilai
            users.forEach(user => {
                if (!user.isAdmin && user.nilai && user.nilai.length > 0) {
                    user.nilai.forEach(n => {
                        filteredNilai.push({ ...n, nis: user.nis, studentName: user.name });
                    });
                }
            });
            displayStudentColumn = true;

        } else {
            nilaiFormSection.style.display = 'none'; // Hide form for student
            nilaiTableStudentHeader.style.display = 'none'; // Hide student column header
            nilaiTableActionsHeader.style.display = 'none'; // Hide actions header
            // Only show current user's nilai
            if (currentUser.nilai) {
                filteredNilai = currentUser.nilai.map(n => ({ ...n, nis: currentUser.nis, studentName: currentUser.name }));
            }
        }

        // Adjust column display based on user role
        // Need to do this AFTER the table is rendered, or modify the initial rendering
        // For now, let's just make sure headers are correctly set
        nilaiTableStudentHeader.style.display = displayStudentColumn ? '' : 'none';
        nilaiTableActionsHeader.style.display = currentUser.isAdmin ? '' : 'none';


        if (filteredNilai.length === 0) {
            noNilaiData.style.display = 'block';
            const colspan = currentUser.isAdmin ? 6 : 4; // Adjust colspan based on admin/student view
            nilaiTableBody.innerHTML = `<tr><td colspan="${colspan}" style="text-align: center;">Belum ada data nilai.</td></tr>`;
            return;
        }
        noNilaiData.style.display = 'none';

        // Sort by student name, then by mata pelajaran
        filteredNilai.sort((a, b) => {
            const nameCompare = (a.studentName || '').localeCompare(b.studentName || '');
            if (nameCompare !== 0) return nameCompare;
            return a.mataPelajaran.localeCompare(b.mataPelajaran);
        });

        filteredNilai.forEach((nilai, index) => {
            const row = nilaiTableBody.insertRow();
            row.insertCell(0).textContent = index + 1;
            const studentNameCell = row.insertCell(1);
            studentNameCell.textContent = nilai.studentName || 'N/A';
            studentNameCell.style.display = displayStudentColumn ? '' : 'none'; // Conditional display

            row.insertCell(2).textContent = nilai.mataPelajaran;
            row.insertCell(3).textContent = nilai.nilaiAngka;
            row.insertCell(4).textContent = nilai.keterangan || '-';

            const actionsCell = row.insertCell(5);
            if (currentUser.isAdmin) {
                actionsCell.classList.add('action-buttons');
                const editBtn = document.createElement('button');
                editBtn.innerHTML = '<i class="fas fa-edit"></i>';
                editBtn.title = 'Edit Nilai';
                editBtn.classList.add('edit-btn');
                editBtn.onclick = () => editNilai(nilai.nis, nilai.id);
                actionsCell.appendChild(editBtn);

                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '<i class="fas fa-trash">';
                deleteBtn.title = 'Hapus Nilai';
                deleteBtn.classList.add('delete-btn');
                deleteBtn.onclick = () => deleteNilai(nilai.nis, nilai.id);
                actionsCell.appendChild(deleteBtn);
            } else {
                 actionsCell.style.display = 'none'; // Hide actions column for student
            }
        });
    }

    function populateNilaiSiswaSelect() {
        nilaiSiswaSelect.innerHTML = '<option value="">Pilih Siswa...</option>';
        const students = users.filter(u => !u.isAdmin);
        // Sort students alphabetically by name
        students.sort((a, b) => a.name.localeCompare(b.name));
        students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.nis;
            option.textContent = `${student.name} (${student.nis})`;
            nilaiSiswaSelect.appendChild(option);
        });
    }

    nilaiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentUser.isAdmin) {
            showFeedback(scanFeedback, 'Akses ditolak. Hanya Admin yang dapat mengelola nilai.', 'error');
            return;
        }

        const nis = nilaiSiswaSelect.value;
        const mataPelajaran = mataPelajaranInput.value.trim();
        const nilaiAngka = parseInt(nilaiAngkaInput.value);
        const keterangan = keteranganNilaiInput.value.trim();
        const nilaiIdToEdit = nilaiIdToEditInput.value;

        if (!nis) {
            showFeedback(scanFeedback, 'Pilih siswa terlebih dahulu.', 'error');
            return;
        }
        if (!mataPelajaran) {
            showFeedback(scanFeedback, 'Mata pelajaran tidak boleh kosong.', 'error');
            return;
        }
        if (isNaN(nilaiAngka) || nilaiAngka < 0 || nilaiAngka > 100) {
            showFeedback(scanFeedback, 'Nilai harus antara 0 dan 100.', 'error');
            return;
        }

        const studentIndex = users.findIndex(u => u.nis === nis);
        if (studentIndex === -1) {
            showFeedback(scanFeedback, 'Siswa tidak ditemukan.', 'error');
            return;
        }

        // Initialize nilai array if it doesn't exist for the student
        if (!users[studentIndex].nilai) {
            users[studentIndex].nilai = [];
        }

        if (nilaiIdToEdit) { // Edit existing nilai
            const nilaiIndex = users[studentIndex].nilai.findIndex(n => n.id == nilaiIdToEdit);
            if (nilaiIndex !== -1) {
                users[studentIndex].nilai[nilaiIndex] = {
                    id: parseInt(nilaiIdToEdit),
                    mataPelajaran,
                    nilaiAngka,
                    keterangan
                };
                showFeedback(scanFeedback, 'Nilai berhasil diperbarui.', 'success');
            } else {
                showFeedback(scanFeedback, 'Nilai yang akan diedit tidak ditemukan.', 'error');
            }
        } else { // Add new nilai
            const newNilai = {
                id: Date.now(), // Generate a unique ID for new nilai
                mataPelajaran,
                nilaiAngka,
                keterangan
            };
            users[studentIndex].nilai.push(newNilai);
            showFeedback(scanFeedback, 'Nilai baru berhasil ditambahkan.', 'success');
        }

        saveUsers();
        renderNilaiTable(); // Re-render table to show changes
        nilaiForm.reset();
        nilaiIdToEditInput.value = '';
        cancelEditNilaiBtn.style.display = 'none';
        nilaiSiswaSelect.value = ''; // Reset select
        nilaiSiswaSelect.disabled = false; // Re-enable select after save
    });

    cancelEditNilaiBtn.addEventListener('click', () => {
        nilaiForm.reset();
        nilaiIdToEditInput.value = '';
        cancelEditNilaiBtn.style.display = 'none';
        nilaiSiswaSelect.value = '';
        nilaiSiswaSelect.disabled = false; // Re-enable select
        showFeedback(scanFeedback, 'Pembatalan edit nilai.', 'info');
    });

    function editNilai(nis, nilaiId) {
        if (!currentUser.isAdmin) {
            showFeedback(scanFeedback, 'Akses ditolak. Hanya Admin yang dapat mengelola nilai.', 'error');
            return;
        }
        const student = users.find(u => u.nis === nis);
        if (!student) {
            showFeedback(scanFeedback, 'Siswa tidak ditemukan untuk diedit nilainya.', 'error');
            return;
        }

        // Pastikan nilai array ada sebelum mencari
        if (!student.nilai) {
            student.nilai = [];
        }

        const nilaiToEdit = student.nilai.find(n => n.id === nilaiId);
        if (nilaiToEdit) {
            nilaiSiswaSelect.value = nis;
            mataPelajaranInput.value = nilaiToEdit.mataPelajaran;
            nilaiAngkaInput.value = nilaiToEdit.nilaiAngka;
            keteranganNilaiInput.value = nilaiToEdit.keterangan;
            nilaiIdToEditInput.value = nilaiToEdit.id;
            cancelEditNilaiBtn.style.display = 'inline-block';

            // Disable student select during edit to prevent changing student for existing score
            nilaiSiswaSelect.disabled = true;
        } else {
            showFeedback(scanFeedback, 'Nilai tidak ditemukan.', 'error');
        }
    }

    function deleteNilai(nis, nilaiId) {
        if (!currentUser.isAdmin) {
            showFeedback(scanFeedback, 'Akses ditolak. Hanya Admin yang dapat menghapus nilai.', 'error');
            return;
        }
        if (confirm('Apakah Anda yakin ingin menghapus nilai ini?')) {
            const studentIndex = users.findIndex(u => u.nis === nis);
            if (studentIndex !== -1) {
                // Pastikan nilai array ada sebelum filter
                if (users[studentIndex].nilai) {
                    users[studentIndex].nilai = users[studentIndex].nilai.filter(n => n.id !== nilaiId);
                }
                saveUsers();
                renderNilaiTable();
                showFeedback(scanFeedback, 'Nilai berhasil dihapus.', 'success');
            } else {
                 showFeedback(scanFeedback, 'Siswa tidak ditemukan untuk menghapus nilainya.', 'error');
            }
        }
    }


    // --- Riwayat Absensi Logic (Admin) ---
    function renderAttendanceHistory(filteredRecords = attendance) {
        if (!currentUser || !currentUser.isAdmin) return;

        riwayatAbsensiTableBody.innerHTML = '';
        const currentFilteredRecords = filteredRecords.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort a copy

        if (currentFilteredRecords.length === 0) {
            noRiwayatData.style.display = 'block';
            riwayatAbsensiTableBody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Tidak ada riwayat absensi.</td></tr>';
            return;
        }
        noRiwayatData.style.display = 'none';


        currentFilteredRecords.forEach((record, index) => {
            const row = riwayatAbsensiTableBody.insertRow();
            row.insertCell(0).textContent = index + 1;
            row.insertCell(1).textContent = record.nis;
            row.insertCell(2).textContent = record.name || 'N/A';
            row.insertCell(3).textContent = new Date(record.timestamp).toLocaleString('id-ID'); // Format locale date time
            row.insertCell(4).textContent = record.status;
            row.insertCell(5).textContent = record.source;

            const detailStatus = calculateAttendanceDetailStatus(record);
            const statusCell = row.insertCell(6);
            statusCell.textContent = detailStatus;
            statusCell.style.color = (detailStatus.includes('Terlambat') || detailStatus.includes('Pulang Cepat') || detailStatus.includes('Izin') || detailStatus.includes('Sakit')) ? 'red' : 'green';
            statusCell.style.fontWeight = 'bold';


            const actionsCell = row.insertCell(7);
            actionsCell.classList.add('action-buttons');
            const viewDetailBtn = document.createElement('button');
            viewDetailBtn.innerHTML = '<i class="fas fa-eye"></i>';
            viewDetailBtn.title = 'Lihat Detail Absensi Siswa';
            viewDetailBtn.classList.add('view-detail-btn');
            viewDetailBtn.onclick = () => openDetailModal(record.nis, record.name);
            actionsCell.appendChild(viewDetailBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.title = 'Hapus Absensi';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.onclick = () => deleteAttendanceRecord(record.id);
            actionsCell.appendChild(deleteBtn);
        });
    }

    function calculateAttendanceDetailStatus(record) {
        if (record.status === 'Izin' || record.status === 'Sakit') {
            return record.status;
        }

        const recordDate = new Date(record.timestamp);
        // Ensure that idealMasuk and idealPulang are converted to Date objects
        // with the same date as the record to allow proper comparison.
        const idealMasuk = new Date(recordDate.toISOString().split('T')[0] + 'T' + settings.idealMasuk);
        const idealPulang = new Date(recordDate.toISOString().split('T')[0] + 'T' + settings.idealPulang);

        if (record.status === 'Masuk') {
            if (recordDate > idealMasuk) {
                const diffMs = recordDate - idealMasuk;
                const diffMins = Math.round(diffMs / (1000 * 60));
                return `Terlambat ${diffMins} menit`;
            } else {
                return 'Tepat Waktu';
            }
        } else if (record.status === 'Pulang') {
            if (recordDate < idealPulang) {
                const diffMs = idealPulang - recordDate;
                const diffMins = Math.round(diffMs / (1000 * 60));
                return `Pulang Cepat ${diffMins} menit`;
            } else {
                return 'Tepat Waktu';
            }
        }
        return ''; // Should not happen for 'Masuk' or 'Pulang'
    }


    function deleteAttendanceRecord(id) {
        if (!currentUser || !currentUser.isAdmin) {
            showFeedback(scanFeedback, 'Akses ditolak. Hanya Admin yang dapat menghapus data absensi.', 'error');
            return;
        }
        if (confirm('Apakah Anda yakin ingin menghapus data absensi ini?')) {
            attendance = attendance.filter(record => record.id !== id);
            saveAttendance();
            renderAttendanceHistory();
            renderDashboard(); // Update dashboard after deletion
            showFeedback(scanFeedback, 'Data absensi berhasil dihapus.', 'success');
        }
    }

    // Attendance History Filtering
    function applyAttendanceFilters() {
        const dateFilter = filterDateInput.value;
        const nisFilter = filterNISInput.value.toLowerCase();

        let filtered = attendance;

        if (dateFilter) {
            filtered = filtered.filter(record => {
                const recordDate = new Date(record.timestamp).toISOString().split('T')[0];
                return recordDate === dateFilter;
            });
        }

        if (nisFilter) {
            filtered = filtered.filter(record =>
                (record.nis && record.nis.toLowerCase().includes(nisFilter)) ||
                (record.name && record.name.toLowerCase().includes(nisFilter))
            );
        }
        renderAttendanceHistory(filtered);
    }

    filterDateInput.addEventListener('change', applyAttendanceFilters);
    filterNISInput.addEventListener('input', applyAttendanceFilters);
    resetFilterBtn.addEventListener('click', () => {
        filterDateInput.value = '';
        filterNISInput.value = '';
        renderAttendanceHistory();
        showFeedback(scanFeedback, 'Filter absensi direset.', 'info');
    });


    // --- Manajemen Siswa Logic (Admin) ---
    function renderManagementTable() {
        if (!currentUser || !currentUser.isAdmin) return;

        manajemenSiswaTableBody.innerHTML = '';
        const students = users.filter(u => !u.isAdmin);

        if (students.length === 0) {
            noManajemenData.style.display = 'block';
            manajemenSiswaTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Belum ada siswa terdaftar.</td></tr>'; // Adjusted colspan
            return;
        }
        noManajemenData.style.display = 'none';

        students.forEach((user, index) => {
            const row = manajemenSiswaTableBody.insertRow();
            row.insertCell(0).textContent = index + 1;
            row.insertCell(1).textContent = user.name;
            row.insertCell(2).textContent = user.nis;
            row.insertCell(3).textContent = user.rfid_id;
            row.insertCell(4).textContent = user.password; // Display password

            const actionsCell = row.insertCell(5);
            actionsCell.classList.add('action-buttons');

            const viewDetailBtn = document.createElement('button');
            viewDetailBtn.innerHTML = '<i class="fas fa-info-circle"></i>';
            viewDetailBtn.title = 'Lihat Detail Akun';
            viewDetailBtn.classList.add('view-detail-btn');
            viewDetailBtn.onclick = () => openViewAccountModal(user);
            actionsCell.appendChild(viewDetailBtn);

            const editBtn = document.createElement('button');
            editBtn.innerHTML = '<i class="fas fa-user-edit"></i>';
            editBtn.title = 'Edit Akun Siswa';
            editBtn.classList.add('edit-btn');
            editBtn.onclick = () => openEditStudentModal(user.nis);
            actionsCell.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.title = 'Hapus Akun Siswa';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.onclick = () => deleteUser(user.nis);
            actionsCell.appendChild(deleteBtn);
        });
    }

    function deleteUser(nisToDelete) {
        if (!currentUser || !currentUser.isAdmin) {
            showFeedback(scanFeedback, 'Akses ditolak. Hanya Admin yang dapat menghapus akun siswa.', 'error');
            return;
        }
        if (confirm(`Apakah Anda yakin ingin menghapus akun siswa dengan NIS ${nisToDelete}? Ini akan menghapus data siswa dan riwayat nilainya, tetapi riwayat absensi tidak akan terhapus otomatis.`)) {
            users = users.filter(u => u.nis !== nisToDelete);
            saveUsers();
            renderManagementTable();
            populateManualAbsenSelect();
            populateNilaiSiswaSelect(); // Update nilai select
            renderDashboard(); // Update dashboard
            showFeedback(scanFeedback, 'Akun siswa berhasil dihapus.', 'success');
        }
    }

    // --- Edit Student Modal Logic (Admin) ---
    function openEditStudentModal(nisToEdit) {
        if (!currentUser || !currentUser.isAdmin) {
            showFeedback(scanFeedback, 'Akses ditolak. Hanya Admin yang dapat mengedit data siswa.', 'error');
            return;
        }
        const student = users.find(u => u.nis === nisToEdit);
        if (student) {
            editStudentOriginalNISInput.value = student.nis; // Store original NIS for lookup
            editStudentNameInput.value = student.name;
            editStudentNISInput.value = student.nis;
            editStudentRFIDInput.value = student.rfid_id;
            editStudentPasswordInput.value = student.password;
            editStudentModal.style.display = 'flex';
        } else {
            showFeedback(scanFeedback, 'Siswa tidak ditemukan.', 'error');
        }
    }

    closeEditStudentModalBtn.addEventListener('click', () => {
        editStudentModal.style.display = 'none';
        editStudentForm.reset();
    });

    editStudentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const originalNis = editStudentOriginalNISInput.value;
        const newName = editStudentNameInput.value.trim();
        const newNis = editStudentNISInput.value.trim();
        const newRfid = editStudentRFIDInput.value.trim();
        const newPassword = editStudentPasswordInput.value.trim();

        const studentIndex = users.findIndex(u => u.nis === originalNis);
        if (studentIndex === -1) {
            showFeedback(scanFeedback, 'Siswa tidak ditemukan untuk diperbarui.', 'error');
            return;
        }

        // Check if new NIS or RFID already exists for *another* user
        const nisExists = users.some(u => u.nis === newNis && u.nis !== originalNis);
        const rfidExists = users.some(u => u.rfid_id === newRfid && u.rfid_id !== users[studentIndex].rfid_id); // Check against original RFID

        if (nisExists) {
            showFeedback(scanFeedback, 'NIS baru sudah digunakan oleh siswa lain!', 'error');
            return;
        }
        if (rfidExists) {
            showFeedback(scanFeedback, 'ID RFID baru sudah digunakan oleh siswa lain!', 'error');
            return;
        }
        if (!newName || !newNis || !newRfid || !newPassword) {
            showFeedback(scanFeedback, 'Semua kolom data siswa harus diisi!', 'error');
            return;
        }

        // Update user data
        users[studentIndex].name = newName;
        users[studentIndex].nis = newNis;
        users[studentIndex].rfid_id = newRfid;
        users[studentIndex].password = newPassword;

        // Also update attendance records with new NIS and Name if NIS changed
        if (originalNis !== newNis) {
            attendance.forEach(rec => {
                if (rec.nis === originalNis) {
                    rec.nis = newNis;
                    rec.name = newName; // Update name in attendance too
                }
            });
            // No need to update nilai records since they are nested under the user object
        }

        saveUsers();
        saveAttendance(); // Save attendance changes if NIS was updated

        showFeedback(scanFeedback, `Data siswa ${newName} berhasil diperbarui.`, 'success');
        editStudentModal.style.display = 'none';
        renderManagementTable();
        populateManualAbsenSelect();
        populateNilaiSiswaSelect(); // Re-populate for updated NIS/Names
        renderAttendanceHistory(); // Re-render history for updated names/NIS
        renderDashboard(); // Re-render dashboard
    });

    // --- View Account Detail Modal Logic (Admin) ---
    function openViewAccountModal(user) {
        if (!currentUser || !currentUser.isAdmin) {
            showFeedback(scanFeedback, 'Akses ditolak. Hanya Admin yang dapat melihat detail akun.', 'error');
            return;
        }
        viewAccountNameSpan.textContent = user.name;
        viewAccountNISSpan.textContent = user.nis;
        viewAccountRFIDSpan.textContent = user.rfid_id;
        viewAccountPasswordSpan.textContent = user.password;
        viewAccountIsAdminSpan.textContent = user.isAdmin ? 'Ya' : 'Tidak';
        viewAccountModal.style.display = 'flex';
    }

    closeViewAccountModalBtn.addEventListener('click', () => {
        viewAccountModal.style.display = 'none';
    });


    // --- Absen Manual Logic (Admin) ---
    function populateManualAbsenSelect() {
        if (!currentUser || !currentUser.isAdmin) return;

        manualNISSelect.innerHTML = '<option value="">Pilih Siswa...</option>';
        const students = users.filter(u => !u.isAdmin);

        // Sort students by name for easier selection
        students.sort((a, b) => a.name.localeCompare(b.name));

        if (students.length === 0) return;

        students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.nis;
            option.textContent = `${student.name} (${student.nis})`;
            manualNISSelect.appendChild(option);
        });
    }

    manualAbsenForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentUser || !currentUser.isAdmin) {
            showFeedback(scanFeedback, 'Akses ditolak. Hanya Admin yang dapat mencatat absensi manual.', 'error');
            return;
        }

        const selectedNIS = manualNISSelect.value;
        const selectedStatus = manualStatusSelect.value;

        if (!selectedNIS) {
            showFeedback(scanFeedback, 'Pilih siswa terlebih dahulu!', 'error');
            return;
        }

        const student = users.find(u => u.nis === selectedNIS);
        if (!student) {
            showFeedback(scanFeedback, 'Siswa tidak ditemukan.', 'error');
            return;
        }

        const newRecord = {
            id: Date.now(),
            nis: student.nis,
            name: student.name,
            rfid_id: student.rfid_id || 'N/A', // Use existing RFID or 'N/A'
            timestamp: new Date().toISOString(),
            status: selectedStatus,
            source: 'Manual'
        };
        attendance.push(newRecord);
        saveAttendance();
        showFeedback(scanFeedback, `Absensi manual untuk ${student.name} (${selectedStatus}) berhasil dicatat.`, 'success');
        manualAbsenForm.reset();
        manualNISSelect.value = '';
        renderAttendanceHistory();
        renderDashboard(); // Update dashboard
    });

    // --- Rekap Absensi Logic (Admin) ---
    generateRekapBtn.addEventListener('click', () => {
        if (!currentUser || !currentUser.isAdmin) {
            showFeedback(scanFeedback, 'Akses ditolak. Hanya Admin yang dapat melihat rekap absensi.', 'error');
            return;
        }
        generateAttendanceRekap();
    });

    function generateAttendanceRekap() {
        rekapAbsensiTableBody.innerHTML = '';

        const startDate = rekapStartDateInput.value;
        const endDate = rekapEndDateInput.value;

        if (!startDate || !endDate) {
            noRekapData.textContent = 'Mohon pilih rentang tanggal untuk generate rekap.';
            noRekapData.style.display = 'block';
            rekapAbsensiTableBody.innerHTML = ''; // Clear table if filters are empty
            return;
        }

        const startTimestamp = new Date(startDate + 'T00:00:00').getTime();
        const endTimestamp = new Date(endDate + 'T23:59:59').getTime();

        if (startTimestamp > endTimestamp) {
            noRekapData.textContent = 'Tanggal mulai tidak boleh lebih dari tanggal selesai.';
            noRekapData.style.display = 'block';
            rekapAbsensiTableBody.innerHTML = ''; // Clear table if dates are invalid
            return;
        }

        const studentUsers = users.filter(u => !u.isAdmin);
        if (studentUsers.length === 0) {
            noRekapData.textContent = 'Belum ada siswa terdaftar untuk direkap.';
            noRekapData.style.display = 'block';
            rekapAbsensiTableBody.innerHTML = ''; // Clear table if no students
            return;
        }

        const rekapData = {};

        studentUsers.forEach(student => {
            rekapData[student.nis] = {
                name: student.name,
                masuk: 0,
                pulang: 0,
                izin: 0,
                sakit: 0,
                uniqueDays: new Set() // To track unique days with attendance
            };
        });

        const filteredAttendance = attendance.filter(rec => {
            const recordTime = new Date(rec.timestamp).getTime();
            return recordTime >= startTimestamp && recordTime <= endTimestamp;
        });

        filteredAttendance.forEach(record => {
            if (rekapData[record.nis]) {
                const recordDate = new Date(record.timestamp).toISOString().split('T')[0];

                if (record.status === 'Masuk') {
                    rekapData[record.nis].masuk++;
                    rekapData[record.nis].uniqueDays.add(recordDate); // Mark this day as attended
                } else if (record.status === 'Pulang') {
                    rekapData[record.nis].pulang++;
                    // Note: Pulang usually implies a 'Masuk' was there, so we might not add to uniqueDays again for Pulang,
                    // unless you want to count every 'scan' as a unique attendance instance.
                    // For "Total Hari Absen", it's usually based on "Masuk" or "Izin/Sakit".
                } else if (record.status === 'Izin') {
                    rekapData[record.nis].izin++;
                    rekapData[record.nis].uniqueDays.add(recordDate); // Izin counts as an attended day
                } else if (record.status === 'Sakit') {
                    rekapData[record.nis].sakit++;
                    rekapData[record.nis].uniqueDays.add(recordDate); // Sakit counts as an attended day
                }
            }
        });

        const rekapEntries = Object.entries(rekapData);

        // Filter out students with no attendance in the selected range to avoid empty rows for everyone
        const relevantRekapEntries = rekapEntries.filter(([nis, data]) =>
            data.masuk > 0 || data.pulang > 0 || data.izin > 0 || data.sakit > 0
        );

        if (relevantRekapEntries.length === 0) {
            noRekapData.textContent = 'Tidak ada data absensi dalam rentang tanggal yang dipilih.';
            noRekapData.style.display = 'block';
            return;
        }

        noRekapData.style.display = 'none';

        relevantRekapEntries.forEach(([nis, data], index) => {
            const row = rekapAbsensiTableBody.insertRow();
            row.insertCell(0).textContent = index + 1;
            row.insertCell(1).textContent = nis;
            row.insertCell(2).textContent = data.name;
            row.insertCell(3).textContent = data.masuk;
            row.insertCell(4).textContent = data.pulang;
            row.insertCell(5).textContent = data.izin;
            row.insertCell(6).textContent = data.sakit;
            row.insertCell(7).textContent = data.uniqueDays.size; // Total unique days with any form of attendance
        });
    }

    // --- Dashboard Logic (Admin) ---
    function renderDashboard() {
        if (!currentUser || !currentUser.isAdmin) return;

        const students = users.filter(u => !u.isAdmin);
        dashboardTotalStudents.textContent = students.length;

        const today = getTodayDateString();
        const todayRecords = attendance.filter(rec =>
            new Date(rec.timestamp).toISOString().split('T')[0] === today
        );

        const studentsPresentNisSet = new Set();
        todayRecords.forEach(rec => {
            if (rec.status === 'Masuk' || rec.status === 'Izin' || rec.status === 'Sakit') {
                studentsPresentNisSet.add(rec.nis);
            }
        });
        dashboardStudentsPresent.textContent = studentsPresentNisSet.size;


        const studentsAbsentToday = students.filter(student => !studentsPresentNisSet.has(student.nis));
        dashboardStudentsAbsent.textContent = studentsAbsentToday.length;

        dashboardTodayAttendanceTableBody.innerHTML = '';
        const todayMasukRecords = todayRecords.filter(rec => rec.status === 'Masuk'); // Only show 'Masuk' on dashboard table
        if (todayMasukRecords.length === 0) {
            noTodayAttendance.style.display = 'block';
            dashboardTodayAttendanceTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Belum ada absensi masuk hari ini.</td></tr>';
        } else {
            noTodayAttendance.style.display = 'none';
            // Sort by time for display in dashboard
            todayMasukRecords.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            todayMasukRecords.forEach(record => {
                const row = dashboardTodayAttendanceTableBody.insertRow();
                row.insertCell(0).textContent = record.nis;
                row.insertCell(1).textContent = record.name;
                row.insertCell(2).textContent = new Date(record.timestamp).toLocaleTimeString('id-ID');
                const statusCell = row.insertCell(3);
                statusCell.textContent = calculateAttendanceDetailStatus(record);
                statusCell.style.color = statusCell.textContent.includes('Terlambat') ? 'red' : 'green';
                statusCell.style.fontWeight = 'bold';
            });
        }
    }

    // --- Settings Logic (Admin - Working Hours) ---
    function loadWorkingHoursSettings() {
        if (!currentUser || !currentUser.isAdmin) return;
        idealMasukTimeInput.value = settings.idealMasuk;
        idealPulangTimeInput.value = settings.idealPulang;
    }

    workingHoursForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentUser || !currentUser.isAdmin) {
            showFeedback(workingHoursFeedback, 'Akses ditolak. Hanya Admin yang dapat mengubah pengaturan.', 'error');
            return;
        }

        const newIdealMasuk = idealMasukTimeInput.value;
        const newIdealPulang = idealPulangTimeInput.value;

        if (!newIdealMasuk || !newIdealPulang) {
            showFeedback(workingHoursFeedback, 'Jam masuk dan pulang tidak boleh kosong.', 'error');
            return;
        }

        // Basic validation: ensure proper time logic
        const [masukH, masukM] = newIdealMasuk.split(':').map(Number);
        const [pulangH, pulangM] = newIdealPulang.split(':').map(Number);

        const masukTotalMinutes = masukH * 60 + masukM;
        const pulangTotalMinutes = pulangH * 60 + pulangM;

        if (pulangTotalMinutes <= masukTotalMinutes) {
            showFeedback(workingHoursFeedback, 'Jam pulang harus setelah jam masuk.', 'error');
            return;
        }

        settings.idealMasuk = newIdealMasuk;
        settings.idealPulang = newIdealPulang;
        saveSettings();
        showFeedback(workingHoursFeedback, 'Pengaturan jam kerja berhasil disimpan!', 'success');
    });

    // --- Detail Modal Logic ---
    function openDetailModal(nis, name) {
        if (!currentUser || !currentUser.isAdmin) {
            showFeedback(scanFeedback, 'Akses ditolak. Hanya Admin yang dapat melihat detail absensi.', 'error');
            return;
        }

        modalStudentName.textContent = name;
        modalStudentNIS.textContent = nis;
        modalAttendanceTableBody.innerHTML = '';
        noDetailData.style.display = 'none';

        const studentRecords = attendance.filter(rec => rec.nis === nis)
                                       .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // Group records by date to show Masuk/Pulang for each day
        const dailyRecords = {};
        studentRecords.forEach(record => {
            const recordDate = new Date(record.timestamp).toISOString().split('T')[0];
            if (!dailyRecords[recordDate]) {
                dailyRecords[recordDate] = {
                    date: recordDate,
                    masuk: 'Belum tercatat',
                    pulang: 'Belum tercatat',
                    keterangan: new Set() // Using a Set to store unique details
                };
            }

            const recordTimeStr = new Date(record.timestamp).toLocaleTimeString('id-ID');
            const detailStatus = calculateAttendanceDetailStatus(record);

            if (record.status === 'Masuk') {
                dailyRecords[recordDate].masuk = recordTimeStr;
                if (detailStatus !== 'Tepat Waktu') {
                    dailyRecords[recordDate].keterangan.add(`Masuk (${detailStatus})`);
                } else {
                     dailyRecords[recordDate].keterangan.add('Masuk (Tepat Waktu)'); // Explicitly state for clarity
                }
            } else if (record.status === 'Pulang') {
                dailyRecords[recordDate].pulang = recordTimeStr;
                if (detailStatus !== 'Tepat Waktu') {
                    dailyRecords[recordDate].keterangan.add(`Pulang (${detailStatus})`);
                } else {
                    dailyRecords[recordDate].keterangan.add('Pulang (Tepat Waktu)'); // Explicitly state for clarity
                }
            } else if (record.status === 'Izin') {
                dailyRecords[recordDate].keterangan.add('Izin');
            } else if (record.status === 'Sakit') {
                dailyRecords[recordDate].keterangan.add('Sakit');
            }
        });

        const sortedDates = Object.keys(dailyRecords).sort((a, b) => new Date(a) - new Date(b));

        if (sortedDates.length === 0) {
            noDetailData.style.display = 'block';
            modalAttendanceTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Tidak ada detail absensi untuk siswa ini.</td></tr>';
        } else {
            sortedDates.forEach(dateStr => {
                const data = dailyRecords[dateStr];
                const row = modalAttendanceTableBody.insertRow();
                row.insertCell(0).textContent = new Date(dateStr).toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'});
                row.insertCell(1).textContent = data.masuk;
                row.insertCell(2).textContent = data.pulang;

                const keteranganCell = row.insertCell(3);
                if (data.keterangan.size > 0) {
                    const sortedKeterangan = Array.from(data.keterangan).sort(); // Sort for consistent display
                    keteranganCell.textContent = sortedKeterangan.join(', ');
                    const hasNegativeStatus = sortedKeterangan.some(status => status.includes('Terlambat') || status.includes('Pulang Cepat') || status.includes('Izin') || status.includes('Sakit') || status.includes('Tidak Hadir'));
                    keteranganCell.style.color = hasNegativeStatus ? 'red' : 'green';
                } else if (data.masuk !== 'Belum tercatat' && data.pulang !== 'Belum tercatat') {
                    keteranganCell.textContent = 'Hadir Penuh';
                    keteranganCell.style.color = 'green';
                } else if (data.masuk === 'Belum tercatat' && data.pulang === 'Belum tercatat') {
                    keteranganCell.textContent = 'Tidak Hadir';
                    keteranganCell.style.color = 'red';
                }
                keteranganCell.style.fontWeight = 'bold';
            });
        }
        detailModal.style.display = 'flex'; // Use flex to center
    }

    closeDetailModalBtn.addEventListener('click', () => {
        detailModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == detailModal) {
            detailModal.style.display = 'none';
        }
        if (event.target == editStudentModal) {
            editStudentModal.style.display = 'none';
            editStudentForm.reset();
        }
        if (event.target == viewAccountModal) {
            viewAccountModal.style.display = 'none';
        }
    });


    // --- Initial Load ---
    updateAppVisibility();
});