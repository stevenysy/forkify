import View from "./View.js";
import previewView from "./previewView.js";
import icons from "url:../../img/icons.svg";

class BookmarksView extends View {
  _parentEl = document.querySelector(".bookmarks__list");
  _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it :)";
  _successMessage = "";

  /**
   * Adds a handler function that renders the bookmarks when the page loads
   * @param {Function} handler
   */
  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }

  /**
   * Generates markup for the preview of each revipe in the data array passed in
   * @returns markup of the preview of each recipe in the data array passed in
   */
  _generateMarkup() {
    console.log(this._data);
    return this._data.map(previewView._generateMarkup).join("");
  }

  /**
   * Generates the markup for a recipe preview
   * @param {{id: number, image: string, title: string, publisher: string}} result preview of recipe
   * @returns
   */
  // #generateMarkupPreview(result) {
  //   const id = window.location.hash.slice(1);

  //   return `
  //   <li class="preview">
  //     <a class="preview__link ${
  //       result.id === id ? "preview__link--active" : ""
  //     }" href="#${result.id}">
  //       <figure class="preview__fig">
  //         <img src="${result.image}" alt="${result.title}" />
  //       </figure>
  //       <div class="preview__data">
  //         <h4 class="preview__title">${result.title}</h4>
  //         <p class="preview__publisher">${result.publisher}</p>
  //       </div>
  //     </a>
  //   </li>
  // `;
  // }
}

export default new BookmarksView();
