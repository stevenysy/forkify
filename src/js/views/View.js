import icons from "url:../../img/icons.svg";

export default class View {
  // The data object needed by the view
  _data;

  /**
   * Renders a view onto the UI
   * @param {Object | Object[]} data Data loaded by the model
   */
  render(data) {
    if (Array.isArray(data) && data.length === 0) return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  /**
   * Updates only the elements that have changed due to an operation
   * @param {Object} data
   */
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    // Create new DOM elements for the new markup
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parentEl.querySelectorAll("*"));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, curEl.isEqualNode(newEl));

      // Update the textContent if the node is a text node and has changed
      if (
        !curEl.isEqualNode(newEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Update attibutes of changed elements
      if (!curEl.isEqualNode(newEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  /**
   * Renders a spinner
   */
  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  /**
   * Renders an error on the UI
   * @param {String} message
   */
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
    </div>
    `;

    console.log(this._errorMessage);

    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._successMessage) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
    </div>
    `;

    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  /**
   * Clears the HTML content of the parent element
   */
  _clear() {
    this._parentEl.innerHTML = "";
  }
}
