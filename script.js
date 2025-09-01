// script.js

const { createApp } = Vue;

createApp({
    data() {
        return {
            searchQuery: '',
            // THIS IS YOUR NEW "DATABASE" OF GAMES!
            // To add a new game, just add a new object to this array.
            games: [
                {
                    id: 1,
                    title: 'Tetris',
                    description: 'The classic block-stacking puzzle game. Clear lines and score big!',
                    url: 'Tetris/index.html',
                    imageUrl: 'https://i.ibb.co/Cc5Z24b/Tetris-Free-PNG.png'
                },
                // Add more games here in the future!
            ]
        };
    },
    computed: {
        // A computed property that automatically updates when 'searchQuery' changes.
        filteredGames() {
            if (!this.searchQuery) {
                return this.games;
            }

            const lowerCaseQuery = this.searchQuery.toLowerCase();

            return this.games.filter(game => {
                return game.title.toLowerCase().includes(lowerCaseQuery);
            });
        }
    }
}).mount('#app'); // This tells Vue to take control of the <div id="app"> element.