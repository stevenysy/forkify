import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
import { AJAX } from "./helpers.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

/**
 * @param {Object} data Object containing the recipe object and the status
 * of the AJAX call
 * @returns A recipe object with formatted entries
 */
const createRecipeObj = function (data) {
  console.log(data);
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

/**
 * Loads the recipe with the given id
 * @param {string} id The ID of the recipe
 */
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObj(data);

    // Check if the recipe loaded is bookmarked
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`${err.message} 💥`);
    throw err;
  }
};

/**
 * Updates the number of servings in the state and the quantity of each ingredient accordingly
 * @param {Number} newServings The number of servings to be updated to
 */
export const updateServings = function (newServings) {
  const curServings = state.recipe.servings;
  state.recipe.servings = newServings;

  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * (newServings / curServings);
  });
};

/**
 * Loads the search results for the given query
 * @param {string} query The search query
 */
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);
    if (!data || !data.results)
      throw new Error(`No recipe found for query "${query}"!`);

    // Create object with less information for each search result
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    console.error(`${err.message} 💥`);
    throw err;
  }
};

/**
 * Returns only the search results for a single page
 * @param {number} page The page Number
 * @returns {Array} An array of the search results of the current page
 */
export const getSearchResultsPage = function (page = 1) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

/**
 * Store bookmarks to localStorage
 */
const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

/**
 * Adds the current recipe to bookmarks
 * @param {Object} recipe The recipe to be added
 */
export const addBookmark = function (recipe) {
  // 1. Add recipe to bookmarks
  state.bookmarks.push(recipe);

  // 2. Mark the recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

/**
 * Deletes the recipe with the given ID from bookmarks
 * @param {Object} id The ID of the recipe being removed
 */
export const deleteBookmark = function (id) {
  // 1. Remove recipe from bookmarks array
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // 2. Mark recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

/**
 * Makes a POST request to the API, updates the recipe in the state with the
 * correspnding data returned from the API, and adds the new recipe to bookmarks
 * @param {Object} newRecipe An recipe object with the ingredients as separate entries
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith("ingredient") && entry[1])
      .map(ing => {
        const ingArr = ing[1].split(",").map(el => el.trim());
        // Throw an error if format is wrong
        if (ingArr.length !== 3)
          throw new Error("Wrong format! Please use the correct format :)");

        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? Number(quantity) : null,
          unit,
          description,
        };
      });

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: Number(newRecipe.servings),
      cooking_time: Number(newRecipe.cookingTime),
      ingredients: ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObj(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

/**
 * Initializes the model by reading bookmark data from local storage
 */
const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

/**
 * Clears bookmarks from localStorage
 */
const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};

/**
 * Deletes recipe with the given id associated with the key from the API
 * @param {String} id
 */
const deleteRecipe = async function (id) {
  await fetch(`${API_URL}/${id}?key=${KEY}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: null,
  });
};
