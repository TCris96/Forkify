import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import recipesView from './views/recipesView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import noRecipeView from './views/noRecipeView.js';
import alertView from './views/alertView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const showRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) {
      return;
    }

    recipeView.renderSpinner();

    // Update results view to mark selected search result
    recipesView.update(model.getResultsPerPage());

    //Update bookmarks
    if (model.state.bookmarks.length) {
      bookmarksView.update(model.state.bookmarks);
    }
  
    //1) Loading the recipe
    await model.loadRecipe(id);

    //2) Rendering the recipe
    recipeView.render(model.state.recipe);
    recipeView.addHandlerUpdateServings(controlServings);
  } catch (error) {
    recipeView.renderError();
  }
}

const controlSearchResults = async function () {
  try {
    recipesView.renderSpinner();
    const query = searchView.getQuery();

    if (!query) {
      return;
    }

    await model.loadSearchedResults(query);

    recipesView.render(model.getResultsPerPage());

    paginationView.render(model.state.search);
  } catch (error) {
    alert(error)
  }
}

const controlPagination = function (pageNo) {
  recipesView.render(model.getResultsPerPage(pageNo));

  paginationView.render(model.state.search);
}

const controlServings = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);

  //Update the recipe view
    recipeView.update(model.state.recipe);
}

const controlBookmark = function() {
  if (model.state.recipe.bookmarked) {
    model.deleteBookmark(model.state.recipe.id);
  } else {
    model.addBookmark(model.state.recipe);
  }

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarksRender = function() {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddNewRecipe = async function(newRecipe) {
  try {
    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    addRecipeView.renderSpinner();

    //Success message
    addRecipeView.renderMessage();
    //Render recipe
    recipeView.render(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);

    //change the URL without rendering the page
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //clear the success message and render the upload form
    // addRecipeView._clearUploadForm();


  } catch(error) {
    addRecipeView.renderError(error.message);
  }

}

const controlDeleteRecipe = function() {
  //Render alert message
  const recipeTitle = model.state.recipe.title;
  const message = `The recipe ${recipeTitle} will be deleted. Are you sure you want to delete it?`;

  alertView.render(message, confirmClicked, cancelClicked);
}

const confirmClicked = function() {
  const deletedRecipe = model.state.recipe.id;

  //Filter the search results array to eliminate the recipe
  model.state.search.results = model.state.search.results.filter(item => item.id !== deletedRecipe);
  
  recipesView.render(model.getResultsPerPage());

  //clear the hash
  clearHash();

  //Render the No Recipe View
  noRecipeView.renderMarkup();

  //Delete the recipe from the bookmarks
  if (model.state.recipe.bookmarked) {
    model.deleteBookmark(deletedRecipe);
    
    bookmarksView.render(model.state.bookmarks);
  }
}

const cancelClicked = function() {
  recipeView.render(model.state.recipe);
}

const clearHashAfterReload = function() {
  const actionType = performance.getEntriesByType("navigation")[0].type
  if (actionType === 'reload') {
    clearHash();
  }
}

const clearHash = function() {
  // Clear the hash part of the URL
  window.location.hash = '';
}

const init = function () {
  noRecipeView.renderMarkup();
  bookmarksView.addHandlerRender(controlBookmarksRender)
  recipeView.eventHandler(showRecipe);
  recipeView.addHandlerAddBookmark(controlBookmark);
  recipeView.addHandlerDeleteRecipe(controlDeleteRecipe);
  searchView.eventHandler(controlSearchResults);
  paginationView.eventHandler(controlPagination);
  addRecipeView.addHandlerAddRecipe(controlAddNewRecipe);
  clearHashAfterReload();
}
init();