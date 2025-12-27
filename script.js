// Games data - loaded from games.json
let games = [];

// State
let currentCategory = 'All';
let searchQuery = '';

// Get unique categories
function getCategories() {
    const categories = ['All', ...new Set(games.map(game => game.category))];
    return categories;
}

// Filter games
function filterGames() {
    return games.filter(game => {
        const matchesCategory = currentCategory === 'All' || game.category === currentCategory;
        const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            game.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });
}

// Create game card HTML
function createGameCard(game, isFeatured = false) {
    if (isFeatured) {
        return `
      <a href="${game.url}" class="featured-card rounded-2xl p-6 flex flex-col gap-4 hover:scale-[1.02] transition-all duration-300 group">
        <div class="relative overflow-hidden rounded-xl aspect-video bg-arcade-dark">
          <img 
            src="${game.imageUrl}" 
            alt="${game.title}"
            class="w-full h-full object-cover game-image"
            onerror="this.src='https://via.placeholder.com/400x225/1a1a2e/00f5ff?text=${encodeURIComponent(game.title)}'"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-arcade-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
            <span class="px-4 py-2 bg-neon-cyan text-arcade-dark font-display font-semibold rounded-lg text-sm">PLAY NOW</span>
          </div>
        </div>
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2 py-1 bg-neon-purple/20 text-neon-purple text-xs font-semibold rounded">${game.category}</span>
            <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h3 class="font-display text-xl font-bold text-gray-100 mb-1">${game.title}</h3>
          <p class="text-gray-400 text-sm line-clamp-2">${game.description}</p>
        </div>
      </a>
    `;
    }

    return `
    <a href="${game.url}" class="game-card rounded-xl overflow-hidden group">
      <div class="relative aspect-square overflow-hidden bg-arcade-dark">
        <img 
          src="${game.imageUrl}" 
          alt="${game.title}"
          class="w-full h-full object-cover game-image"
          onerror="this.src='https://via.placeholder.com/200x200/1a1a2e/00f5ff?text=${encodeURIComponent(game.title)}'"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-arcade-dark via-transparent to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-3">
          <span class="px-2 py-0.5 bg-neon-cyan/20 text-neon-cyan text-xs font-medium rounded">${game.category}</span>
        </div>
        <div class="absolute inset-0 bg-neon-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span class="px-4 py-2 bg-neon-cyan text-arcade-dark font-display font-semibold rounded-lg text-sm">PLAY</span>
        </div>
      </div>
      <div class="p-3">
        <h3 class="font-display text-sm font-bold text-gray-100 truncate">${game.title}</h3>
        <p class="text-gray-500 text-xs truncate mt-1">${game.description}</p>
      </div>
    </a>
  `;
}

// Render featured games (limit to 3)
function renderFeaturedGames() {
    const container = document.getElementById('featuredGames');
    if (!container) return;
    const featuredGames = games.filter(game => game.featured).slice(0, 3);
    container.innerHTML = featuredGames.map(game => createGameCard(game, true)).join('');
}

// Render category filters
function renderCategoryFilters() {
    const container = document.getElementById('categoryFilters');
    const categories = getCategories();

    container.innerHTML = categories.map(category => `
    <button 
      class="category-btn px-4 py-2 rounded-lg font-medium text-sm ${category === currentCategory ? 'active' : ''}"
      data-category="${category}"
    >
      ${category}
    </button>
  `).join('');

    // Add click handlers
    container.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.category;
            renderCategoryFilters();
            renderGamesGrid();
        });
    });
}

// Render games grid
function renderGamesGrid() {
    const container = document.getElementById('gamesGrid');
    const noResults = document.getElementById('noResults');
    const filteredGames = filterGames();

    if (filteredGames.length === 0) {
        container.innerHTML = '';
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        container.innerHTML = filteredGames.map(game => createGameCard(game)).join('');
    }
}

// Initialize search
function initSearch() {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderGamesGrid();
    });
}

// Initialize app
async function initApp() {
    try {
        // Load games from JSON file
        const response = await fetch('games.json');
        games = await response.json();

        // Render all components
        renderFeaturedGames();
        renderCategoryFilters();
        renderGamesGrid();
        initSearch();
    } catch (error) {
        console.error('Error loading games:', error);
    }
}

document.addEventListener('DOMContentLoaded', initApp);