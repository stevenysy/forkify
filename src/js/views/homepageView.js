import View from "./View.js";

class HomepageView extends View {
  _parentEl = document.querySelector(".header__logo");

  constructor() {
    super();
    this.#addHandlerHomepage();
  }

  /**
   * Adds an event listener on the website logo that listens for the click event and
   * navigates back to the root of the website when clicked
   */
  #addHandlerHomepage() {
    this._parentEl.addEventListener("click", function () {
      window.location = "/";
    });
  }
}

export default new HomepageView();
