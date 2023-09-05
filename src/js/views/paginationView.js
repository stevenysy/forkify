import View from "./View.js";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
  _parentEl = document.querySelector(".pagination");

  /**
   * Adds a handler function to the buttons that change the page
   * @param {function} handler
   */
  addHandlerClick(handler) {
    this._parentEl.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;

      const goToPage = Number(btn.dataset.goto);

      handler(goToPage);
    });
  }

  /**
   * Generates markup of pagination buttons based on the current page
   * @returns Markup of pagination buttons
   */
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);
    console.log(curPage);

    // Page 1 and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this.#generateMarkupNext(curPage);
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return this.#generateMarkupPrev(curPage);
    }

    // Other pages
    if (curPage < numPages) {
      return `
        ${this.#generateMarkupPrev(curPage)}
        ${this.#generateMarkupNext(curPage)}
      `;
    }

    // Page 1 and no other pages
    return "";
  }

  /**
   * Generates the markup for the button that loads the next page
   * @param {number} page
   * @returns Markup for the button that loads the next page
   */
  #generateMarkupNext(page) {
    return `
      <button data-goto="${page + 1}" class="btn--inline pagination__btn--next">
        <span>Page ${page + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;
  }

  /**
   * Generates the markup for the button that loads the previous page
   * @param {number} page
   * @returns Markup for the button that loads the previous page
   */
  #generateMarkupPrev(page) {
    return `
      <button data-goto="${page - 1}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${page - 1}</span>
      </button>
    `;
  }
}

export default new PaginationView();
