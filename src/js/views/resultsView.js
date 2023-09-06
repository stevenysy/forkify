import View from "./View.js";
import previewView from "./previewView.js";
import icons from "url:../../img/icons.svg";

class ResultsView extends View {
  _parentEl = document.querySelector(".results");
  _errorMessage = "No recipes found for your query! Please try again!";
  _successMessage = "";

  /**
   * Generates markup for the preview of each revipe in the data array passed in
   * @returns markup of the preview of each recipe in the data array passed in
   */
  _generateMarkup() {
    return this._data.map(previewView._generateMarkup).join("");
  }
}

export default new ResultsView();
