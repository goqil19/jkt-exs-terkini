document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const loginSection = document.getElementById('loginSection');
    const adminPanel = document.getElementById('adminPanel');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const logoutBtn = document.getElementById('logoutBtn');
    
    const newsForm = document.getElementById('newsForm');
    const formTitle = document.getElementById('formTitle');
    const formMsg = document.getElementById('formMsg');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveBtn');
    
    const newsIdInput = document.getElementById('newsId');
    const titleInput = document.getElementById('title');
    const sourceInput = document.getElementById('source');
    const imageUrlInput = document.getElementById('imageUrl');
    const newsUrlInput = document.getElementById('newsUrl');
    
    const adminNewsList = document.getElementById('adminNewsList');

    let currentSession = null;

    // Check auth status on load
    checkAuth();

    // Set up auth listener
    supabase.auth.onAuthStateChange((event, session) => {
        currentSession = session;
        if (session) {
            showAdminPanel();
        } else {
            showLogin();
        }
    });

    // Login Form Submit
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const loginBtn = document.getElementById('loginBtn');
        const originalText = loginBtn.textContent;
        loginBtn.textContent = 'Memproses...';
        loginBtn.disabled = true;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            loginError.textContent = 'Login gagal: ' + error.message;
            loginBtn.textContent = originalText;
            loginBtn.disabled = false;
        } else {
            loginError.textContent = '';
        }
    });

    // Logout
    logoutBtn.addEventListener('click', async () => {
        await supabase.auth.signOut();
    });

    // News Form Submit (Create/Update)
    newsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = newsIdInput.value;
        const title = titleInput.value;
        const source = sourceInput.value;
        const image_url = imageUrlInput.value || null;
        const news_url = newsUrlInput.value;

        saveBtn.textContent = 'Menyimpan...';
        saveBtn.disabled = true;
        formMsg.className = 'form-msg';
        formMsg.textContent = '';

        try {
            if (id) {
                // Update
                const { error } = await supabase
                    .from('news_links')
                    .update({ title, source, image_url, news_url })
                    .eq('id', id);
                    
                if (error) throw error;
                showMessage('Berita berhasil diperbarui', 'success');
            } else {
                // Insert
                const { error } = await supabase
                    .from('news_links')
                    .insert([{ title, source, image_url, news_url }]);
                    
                if (error) throw error;
                showMessage('Berita berhasil ditambahkan', 'success');
            }
            
            resetForm();
            fetchAdminNews();
        } catch (error) {
            showMessage('Error: ' + error.message, 'error');
        } finally {
            saveBtn.textContent = 'Simpan';
            saveBtn.disabled = false;
        }
    });

    // Cancel Edit
    cancelBtn.addEventListener('click', resetForm);

    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession();
        currentSession = session;
        if (session) {
            showAdminPanel();
        } else {
            showLogin();
        }
    }

    function showLogin() {
        loginSection.style.display = 'flex';
        adminPanel.style.display = 'none';
    }

    function showAdminPanel() {
        loginSection.style.display = 'none';
        adminPanel.style.display = 'block';
        fetchAdminNews();
    }

    async function fetchAdminNews() {
        adminNewsList.innerHTML = '<div id="adminLoading">Memuat data...</div>';
        
        try {
            const { data, error } = await supabase
                .from('news_links')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            adminNewsList.innerHTML = '';
            
            if (data.length === 0) {
                adminNewsList.innerHTML = '<p style="color: var(--text-muted);">Belum ada berita tersimpan.</p>';
                return;
            }

            data.forEach(news => {
                const item = document.createElement('div');
                item.className = 'admin-list-item';
                
                const date = new Date(news.created_at).toLocaleDateString('id-ID');
                
                item.innerHTML = `
                    <div class="item-info">
                        <h4>${news.title}</h4>
                        <p>${news.source} • ${date}</p>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-outline edit-btn" data-id="${news.id}">Edit</button>
                        <button class="btn btn-danger del-btn" data-id="${news.id}">Hapus</button>
                    </div>
                `;
                
                adminNewsList.appendChild(item);
            });

            // Add event listeners to new buttons
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    const news = data.find(n => n.id == id);
                    if (news) editNews(news);
                });
            });

            document.querySelectorAll('.del-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
                        deleteNews(id);
                    }
                });
            });

        } catch (error) {
            adminNewsList.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        }
    }

    function editNews(news) {
        formTitle.textContent = 'Edit Berita';
        newsIdInput.value = news.id;
        titleInput.value = news.title;
        sourceInput.value = news.source;
        imageUrlInput.value = news.image_url || '';
        newsUrlInput.value = news.news_url;
        
        cancelBtn.style.display = 'inline-block';
        saveBtn.textContent = 'Update';
        
        // Scroll to form
        document.querySelector('.admin-form-section').scrollIntoView({ behavior: 'smooth' });
    }

    async function deleteNews(id) {
        try {
            const { error } = await supabase
                .from('news_links')
                .delete()
                .eq('id', id);
                
            if (error) throw error;
            
            fetchAdminNews();
            // If deleting currently edited item, reset form
            if (newsIdInput.value == id) {
                resetForm();
            }
        } catch (error) {
            alert('Gagal menghapus: ' + error.message);
        }
    }

    function resetForm() {
        formTitle.textContent = 'Tambah Berita';
        newsForm.reset();
        newsIdInput.value = '';
        cancelBtn.style.display = 'none';
        saveBtn.textContent = 'Simpan';
    }

    function showMessage(msg, type) {
        formMsg.textContent = msg;
        formMsg.className = `form-msg ${type}`;
        setTimeout(() => {
            formMsg.textContent = '';
            formMsg.className = 'form-msg';
        }, 5000);
    }
});
