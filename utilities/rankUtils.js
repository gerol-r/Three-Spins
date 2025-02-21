// Function to check if the rank is already used
function isRankUsed(user, rank) {
    return user.songs.some(song => song.rank === rank);
};

// Helper function to map rank numbers to display text (using arrow function)
const getRankText = (rank) => {
    switch (rank) {
      case 1:
        return "Number 1 All Time!";
      case 2:
        return "My Second Fav!";
      case 3:
        return "Third But Not Least!";
      default:
        return "Unknown Rank";
    }
  };
  
  module.exports = {
    getRankText,
    isRankUsed,
  };