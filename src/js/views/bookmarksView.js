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
    return this._data.map(previewView._generateMarkup).join("");
  }
}

export default new BookmarksView();
