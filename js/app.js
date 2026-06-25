document.addEventListener('DOMContentLoaded', () => {
    const newsGrid = document.getElementById('newsGrid');
    const loadingEl = document.getElementById('loading');
    const noResultsEl = document.getElementById('noResults');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    // Fetch initial data
    fetchNews();

    // Search events
    searchBtn.addEventListener('click', () => {
        fetchNews(searchInput.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchNews(searchInput.value);
        }
    });

    async function fetchNews(searchQuery = '') {
        // Show loading state
        loadingEl.style.display = 'block';
        newsGrid.style.display = 'none';
        noResultsEl.style.display = 'none';
        newsGrid.innerHTML = '';

        try {
            let query = supabase
                .from('news_links')
                .select('*')
                .order('created_at', { ascending: false });

            if (searchQuery.trim() !== '') {
                query = query.ilike('title', `%${searchQuery}%`);
            }

            const { data, error } = await query;

            if (error) throw error;

            loadingEl.style.display = 'none';

            if (data && data.length > 0) {
                renderNews(data);
                newsGrid.style.display = 'grid';
            } else {
                noResultsEl.style.display = 'block';
            }

        } catch (error) {
            console.error('Error fetching news:', error.message);
            loadingEl.textContent = 'Gagal memuat berita. Silakan coba lagi.';
        }
    }

    function renderNews(newsList) {
        newsList.forEach(news => {
            const date = new Date(news.created_at).toLocaleDateString('id-ID', {
                year: 'numeric', month: 'short', day: 'numeric'
            });

            // Handle image fallback
            const imageUrl = news.image_url ? news.image_url : '';
            const imageHtml = imageUrl 
                ? `<img src="${imageUrl}" alt="${news.title}" class="card-img" loading="lazy" onerror="this.style.display='none'">`
                : `<div class="card-img-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                   </div>`;

            const card = document.createElement('article');
            card.className = 'card';
            
            // Add click event for the whole card
            card.addEventListener('click', () => {
                window.open(news.news_url, '_blank', 'noopener,noreferrer');
            });

            card.innerHTML = `
                <div class="card-img-wrapper">
                    ${imageHtml}
                </div>
                <div class="card-content">
                    <span class="card-source">${news.source}</span>
                    <h3 class="card-title">${news.title}</h3>
                    <div class="card-meta">
                        <span>${date}</span>
                    </div>
                </div>
            `;

            newsGrid.appendChild(card);
        });
    }
});
