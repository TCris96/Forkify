import {API_URL, RESULTS_PER_PAGR, KEY} from './config.js';
import {AJAX} from './helpers.js';

export const state = {
    recipe : {},
    search : {
        query : '',
        oldQuery: '',
        results : [],
        page : 1,
        resultsPerPage : RESULTS_PER_PAGR,
    },
    bookmarks : [],
    userGeneratedRecipes: [],
};

/**
 * Create the formatted object of the API object
 * @param {Object} data 
 * @returns Object
 */
const formatRecipe = function(data) {
    const {recipe} = data.data;
    
    return{
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      ...(recipe.key && {key: recipe.key}),
    };
}

export async function loadRecipe(id) {
    try {
        const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
        state.recipe = formatRecipe(data);
        
        if (state.bookmarks.some(function(bookmark) {
            return bookmark.id === id;
        })) {
            state.recipe.bookmarked = true;
        } else {
            state.bookmarked = false;
        }
    } catch (error) {
        throw error;
    }
}

export async function loadSearchedResults(query) {
    try{
        state.search.page = 1;
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
        state.search.results = data.data.recipes.map(function(recipe) {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
                ...(recipe.key && {key: recipe.key}),
            }
        });
    } catch(error) {
        throw error;
    }
}

export function getResultsPerPage(page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * RESULTS_PER_PAGR;
    const end = page * RESULTS_PER_PAGR;

    return state.search.results.slice(start, end);
}

export function updateServings(newServings) {
    state.recipe.ingredients.forEach(ingredient => {
        ingredient.quantity = ingredient.quantity * newServings / state.recipe.servings;
    });
    
    state.recipe.servings = newServings;
}

const persistBookmarks = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export function addBookmark(recipe) {
    state.bookmarks.push(recipe);

    persistBookmarks();

    if (recipe.id === state.recipe.id){
        state.recipe.bookmarked = true;
    }
}

export function deleteBookmark(id) {
    const index = state.bookmarks.findIndex(function(element) {
        return element.id === id;
    });

    state.bookmarks.splice(index, 1);

    persistBookmarks();

    if (id === state.recipe.id) {
        state.recipe.bookmarked = false;
    }
}

export async function uploadRecipe(newRecipe) {
    try {
        let unformattedIngredients = [];

        for (let i = 1; i <= 6; i++){
            const ingredientName = `ingredient-${i}`;
            const ingredient = Object.entries(newRecipe)
                .filter(entry => entry[0].startsWith(ingredientName) && entry[1] !== '');
            
            if (ingredient.length) {
                unformattedIngredients.push(ingredient);
            }
        }

        const ingredients = unformattedIngredients.map(ingredient => {
            const ingredientSpec = ingredient.map(entry => entry[1]);
            
               return {quantity: ingredientSpec ? Number(ingredientSpec[0]) : null,
                unit: ingredientSpec[1],
                description: ingredientSpec[2]};
        });

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: Number(newRecipe.cookingTime),
            servings: Number(newRecipe.servings),
            ingredients,
        };

        const result = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = formatRecipe(result);

        addBookmark(state.recipe);

    } catch(error) {
        throw error;
    }
}

const init = function() {
    const storage = localStorage.getItem('bookmarks');

    if (storage && storage !== 'undefined') {
        state.bookmarks = JSON.parse(storage);
    }
}
init();