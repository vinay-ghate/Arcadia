const { createApp } = Vue;

createApp({
  data() {
    return {
      allGames: [],
      categories: [
        {
          name: "All",
          imageUrl:
            "https://cdn.pixabay.com/photo/2024/01/25/06/56/gaming-logo-8531082_1280.png",
        },
        {
          name: "Action",
          imageUrl:
            "https://images-platform.99static.com//j1e4FL84V26EXY447wNzOzCHfIY=/0x1:598x599/fit-in/590x590/projects-files/29/2973/297372/fc771dcc-cb62-4e22-aee0-7183de1f370c.jpg",
        },
        {
          name: "Puzzle",
          imageUrl: "https://cdn-icons-png.flaticon.com/512/8193/8193239.png",
        },
        {
          name: "Adventure",
          imageUrl:
            "https://i.pinimg.com/736x/e8/12/4f/e8124faec04cfc2d5a860c2dae81fdc4.jpg",
        },
        {
          name: "Classics",
          imageUrl:
            "https://images-platform.99static.com/UM61dCpvHIAm2NbHVJ1NEMWLvfM=/0x0:1181x1181/500x500/top/smart/99designs-contests-attachments/95/95385/attachment_95385420",
        },
      ],
      searchQuery: "",
      selectedCategory: "All",
      isLoading: true,
    };
  },
  computed: {
    filteredGames() {
      let games = this.allGames;

      // Filter by category
      if (this.selectedCategory !== "All") {
        games = games.filter(
          (game) => game.category && game.category === this.selectedCategory
        );
      }

      // Filter by search query
      if (this.searchQuery.trim()) {
        const lowerCaseQuery = this.searchQuery.trim().toLowerCase();
        games = games.filter((game) =>
          game.title.toLowerCase().includes(lowerCaseQuery)
        );
      }

      return games;
    },

    // ✅ Needed for your featured section
    featuredGames() {
      return this.allGames.filter((game) => game.featured === true);
    },
  },
  methods: {
    selectCategory(categoryName) {
      this.selectedCategory = categoryName;
      this.searchQuery = "";
    },
  },
  mounted() {
    fetch("games.json")
      .then((response) => response.json())
      .then((data) => {
        // ensure fallback category if missing
        this.allGames = data.map((game) => ({
          ...game,
          category: game.category || "Classics",
        }));
        console.log("Loaded games:", this.allGames);
      })
      .catch((error) => console.error("Error fetching games:", error))
      .finally(() => {
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      });
  },
}).mount("#app");
