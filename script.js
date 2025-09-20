// Wait for the HTML document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    
    const gameContainer = document.getElementById('game-container');

    // Function to generate the game blocks on the page
    const createGameBlocks = (gamesData) => {
        if (!gameContainer) {
            console.error("Game container not found!");
            return;
        }

        // Loop through each game in the gamesData array
        gamesData.forEach(game => {
            // Create an anchor tag 'a' to make the entire block clickable
            const block = document.createElement('a');
            block.className = 'game-block'; // Add the 'game-block' class for styling
            block.href = game.url; // Set the link for the game

            // Set the background image dynamically using an inline style
            block.style.backgroundImage = `url('${game.imageUrl}')`;

            // Create the inner content for the block
            block.innerHTML = `
                <div class="block-content">
                    <h2>${game.title}</h2>
                    <p>${game.description}</p>
                </div>
            `;

            // Append the newly created block to the game container
            gameContainer.appendChild(block);
        });
    };
    
    // Fetch the game data from the JSON file
    fetch('games.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Parse the JSON
        })
        .then(data => {
            createGameBlocks(data); // Call the function to create blocks with the loaded data
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            gameContainer.innerHTML = '<p style="color: #e94560;">Sorry, could not load the games. Please check if the games.json file is present and correct.</p>';
        });
});