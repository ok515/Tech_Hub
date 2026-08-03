/**
 * Tech Hub 2026 - Master Application Logic
 * Pure Vanilla JavaScript (Zero Dependencies)
 */

document.addEventListener('DOMContentLoaded', async () => {
    // State management
    const state = {
        articles: [],
        aiComparisons: [],
        filteredCategory: 'all',
        searchQuery: '',
        bookmarks: JSON.parse(localStorage.getItem('techhub_bookmarks') || '[]'),
        isDark: localStorage.getItem('techhub_theme') !== 'light'
    };

    // Load Data
    try {
        const response = await fetch('data/articles.json');
        if (response.ok) {
            const data = await response.json();
            state.articles = data.articles || [];
            state.aiComparisons = data.aiComparisons || [];
            renderAIComparisons(state.aiComparisons);
        }
    } catch (err) {
        console.warn('Local JSON load fallback activated', err);
    }

    // Filter Chips Event Listeners
    const categoryChips = document.querySelectorAll('.tag-chip');
    categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            categoryChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            state.filteredCategory = chip.dataset.category || 'all';
            filterArticles();
        });
    });

    // Search Input Listener
    const searchInput = document.getElementById('main-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value.toLowerCase().trim();
            filterArticles();
        });
    }

    // Filter Logic
    function filterArticles() {
        const cards = document.querySelectorAll('.article-card');
        cards.forEach(card => {
            const category = card.dataset.category || '';
            const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const excerpt = card.querySelector('.card-excerpt')?.textContent.toLowerCase() || '';

            const matchesCategory = state.filteredCategory === 'all' || category === state.filteredCategory;
            const matchesSearch = !state.searchQuery || title.includes(state.searchQuery) || excerpt.includes(state.searchQuery);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                card.style.animation = 'fadeIn 0.3s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Render AI Comparisons Section
    function renderAIComparisons(comparisons) {
        const container = document.getElementById('ai-comparisons-container');
        if (!container || !comparisons.length) return;

        container.innerHTML = comparisons.map(comp => `
            <div class="comparison-card glass-panel">
                <div>
                    <span class="comp-badge">${comp.badge}</span>
                    <h3 class="comp-title">${comp.title}</h3>
                    <div class="comp-winner">🏆 Winner: ${comp.winner}</div>
                    <div class="comp-metric">⚡ ${comp.metric}</div>
                    <p class="comp-summary">${comp.summary}</p>
                </div>
                <button class="cta-btn" style="margin-top: 16px; padding: 10px 18px; font-size: 0.85rem;" onclick="alert('Opening benchmark report for ${comp.title}')">
                    Full Comparison Benchmark →
                </button>
            </div>
        `).join('');
    }

    // Bookmark Toggle Logic
    const bookmarkBtn = document.getElementById('bookmarks-btn');
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', () => {
            alert(`You have ${state.bookmarks.length} saved articles in your offline cache.`);
        });
    }

    // Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            state.isDark = !state.isDark;
            localStorage.setItem('techhub_theme', state.isDark ? 'dark' : 'light');
            document.documentElement.classList.toggle('dark', state.isDark);
            themeBtn.textContent = state.isDark ? '🌙' : '☀️';
        });
    }
});
