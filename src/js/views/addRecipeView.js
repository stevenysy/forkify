import View from "./View.js";
import icons from "url:../../img/icons.svg";

class AddRecipeView extends View {
  _parentEl = document.querySelector(".upload");
  _successMessage = "Recipe was uploaded successfully :)";

  #window = document.querySelector(".add-recipe-window");
  #overlay = document.querySelector(".overlay");
  #btnOpen = document.querySelector(".nav__btn--add-recipe");
  #btnClose = document.querySelector(".btn--close-modal");

  constructor() {
    super();
    this.#addHandlerShowWindow();
    this.#addHandlerCloseWindow();
  }

  /**
   * Toggles the overlay and window on or off
   */
  toggleWindow() {
    this.#overlay.classList.toggle("hidden");
    this.#window.classList.toggle("hidden");
  }

  /**
   * Adds an event listener onto the add recipe button that listens for
   * the click event and shows the window with the form
   */
  #addHandlerShowWindow() {
    this.#btnOpen.addEventListener("click", this.toggleWindow.bind(this));
  }

  /**
   * Adds an event listener onto the close button and the overlay that listens
   * for the click event and hides the window with the form and the overlay
   */
  #addHandlerCloseWindow() {
    this.#btnClose.addEventListener("click", this.toggleWindow.bind(this));
    this.#overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  /**
   * Converts the form response into a recipe object after the form submits
   * and handles the object with the handler function
   * @param {Function} handler Handler function for the recipe object
   */
  addHandlerUpload(handler) {
    this._parentEl.addEventListener("submit", function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  /**
   * Generates the HTML for the upload recipe form
   * @returns HTML for the upload recipe form
   */
  _generateMarkup() {
    return `
      <form class="upload">
        <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input value="TEST49" required name="title" type="text" />
          <label>URL</label>
          <input value="TEST49" required name="sourceUrl" type="text" />
          <label>Image URL</label>
          <input value="TEST49" required name="image" type="text" />
          <label>Publisher</label>
          <input value="TEST49" required name="publisher" type="text" />
          <label>Prep time</label>
          <input value="23" required name="cookingTime" type="number" />
          <label>Servings</label>
          <input value="23" required name="servings" type="number" />
        </div>

        <div class="upload__column">
          <h3 class="upload__heading">Ingredients</h3>
          <label>Ingredient 1</label>
          <input
            value="0.5,kg,Rice"
            type="text"
            required
            name="ingredient-1"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 2</label>
          <input
            value="1,,Avocado"
            type="text"
            name="ingredient-2"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 3</label>
          <input
            value=",,salt"
            type="text"
            name="ingredient-3"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 4</label>
          <input
            type="text"
            name="ingredient-4"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 5</label>
          <input
            type="text"
            name="ingredient-5"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 6</label>
          <input
            type="text"
            name="ingredient-6"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
        </div>

        <button class="btn upload__btn">
          <svg>
            <use href="src/img/icons.svg#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>
      </form>
    `;
  }
}

export default new AddRecipeView();
