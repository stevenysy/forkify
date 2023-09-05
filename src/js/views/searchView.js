class SearchView {
  #parentEl = document.querySelector(".search");

  /**
   * Method for getting the query entered
   * @returns {string} Query entered
   */
  getQuery() {
    const query = this.#parentEl.querySelector(".search__field").value;
    this.#clearInput();
    return query;
  }

  /**
   * Clears the form's input field
   */
  #clearInput() {
    this.#parentEl.querySelector(".search__field").value = "";
  }

  /**
   * Adds a handler function to the form submit event
   * @param {function} handler
   */
  addHandlerSearch(handler) {
    this.#parentEl.addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
