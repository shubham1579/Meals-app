
const searchInput = document.getElementById('search-input');
const searchResultsContainer = document.getElementById('search-results');
const favoritesList = document.getElementById('favorites-list');

let favorites = [];

// Event listener for search input
searchInput.addEventListener('input', debounce(searchMeals, 300));

// Fetching and display search results
function searchMeals() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm === '') {
        searchResultsContainer.innerHTML = '';
        return;
    }

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
        .then(response => response.json())
        .then(data => {
            const meals = data.meals || [];
            const resultsHtml = meals.map(meal => `
                <div class="card">
                    <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                    <div class="card-body">
                        <h5 class="card-title">${meal.strMeal}</h5>
                        <button class="btn btn-primary btn-sm" onclick="addToFavorites('${meal.idMeal}', '${meal.strMeal}', '${meal.strMealThumb}')">Add to Favorites</button>
                    </div>
                </div>
            `).join('');

            searchResultsContainer.innerHTML = resultsHtml;
        })
        .catch(error => console.error(error));
}

// Add meal to favorites
function addToFavorites(id, name, thumbnail) {
    if (!favorites.some(meal => meal.id === id)) {
        favorites.push({ id, name, thumbnail });
        updateFavoritesList();
    }
}

// Update favorites list
function updateFavoritesList() {
    favoritesList.innerHTML = favorites.map(meal => `
        <li class="favorite-item">
            <span class="favorite-name">${meal.name}</span>
            <button class="btn btn-danger btn-sm favorite-remove" onclick="removeFromFavorites('${meal.id}')">Remove</button>
        </li>
    `).join('');

    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Remove meal from favorites
function removeFromFavorites(id) {
    favorites = favorites.filter(meal => meal.id !== id);
    updateFavoritesList();
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}

// Initialize app
function init() {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites'));
    if (storedFavorites) {
        favorites = storedFavorites;
        updateFavoritesList();
    }
}

init();
