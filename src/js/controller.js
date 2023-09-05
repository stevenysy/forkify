import { async } from "regenerator-runtime";
import { MODAL_CLOSE_SEC, RERENDER_FORM_SEC } from "./config.js";
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

// Polyfilling
import "core-js/stable";
import "regenerator-runtime/runtime";

// Hot module reloading
// if (module.hot) {
//   module.hot.accept();
// }

/**
 * Controller function for events on the recipe parent element
 */
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    // 0. Update search results to highlight selected recipe
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1. Loading recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    // 2. Rendering recipe
    recipeView.render(recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

/**
 * Controller function for events on the results parent element
 */
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1. Get query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load search results
    await model.loadSearchResults(query);

    // 3. Render search results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4. Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
    resultsView.renderError();
  }
};

/**
 * Controller function for events on the pagination parent element
 * @param {Number} goToPage The page to be displayed in the search section
 */
const controlPagination = function (goToPage) {
  // 1. Render new search results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2. Render new pagination buttons
  paginationView.render(model.state.search);
};

/**
 * Controller function for the update servings functionality
 * @param {Number} newServings The new number of servings
 */
const controlServings = function (newServings) {
  // 1. Update recipe servings in state
  model.updateServings(newServings);

  // 2. Update recipe view
  console.log(model.state.recipe);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

/**
 * Controller function for the add/remove bookmark functionality
 */
const controlAddBookmark = function () {
  // 1. Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. Update the recipe view to show the filled/unfilled bookmark icon
  recipeView.update(model.state.recipe);

  // 3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

/**
 * Controller function for rendering the bookmarks when the app starts
 */
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

/**
 * Controller function for uploading a user custom recipe. This function
 * uploads the received recipe to the API and renders the recipe to the recipeView
 * @param {Object} newRecipe An recipe object with the ingredients as separate entries
 */
const controlUploadRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe and bookmarks
    recipeView.render(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // Display success message
    addRecipeView.renderMessage();

    // Close form window and re-render form
    setTimeout(() => {
      addRecipeView.toggleWindow();
      setTimeout(() => addRecipeView.render(), RERENDER_FORM_SEC * 1000);
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

/**
 * Initializes the app
 */
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlUploadRecipe);
  console.log("Welcome to the app!");
};
init();
