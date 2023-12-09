import icons from 'url:../../img/icons.svg'; //Parcel 2

export default class View {
    _data;

    /**
     * Render the received object to the DOM
     * @param {Object} data The data to be rendered (e.g recipe)
     */
    render(data) {
        if (!data || (Array.isArray(data) && data.length === 0)) {
            this.renderError();
            return;
        }

        this._data = data;
        const markup = this._generateMarkup();
        this._clearParentContainer();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    /**
     * Update the DOM elements without rendering the page
     * @param {Object} data 
     */
    update(data) {
        this._data = data;
        const NewMarkup = this._generateMarkup();

        const newElements = Array.from(
            document.createRange()
            .createContextualFragment(NewMarkup)
            .querySelectorAll('*')
        );
        
        const currentElements = Array.from(this._parentElement.querySelectorAll('*'));

        currentElements.forEach(function(currentElement, index) {
            const newElement = newElements[index];
            if (!currentElement.isEqualNode(newElement)) {

                if (newElement.firstChild?.nodeValue.trim() !== '') {
                    currentElement.textContent = newElement.textContent;
                }

                Array.from(newElement.attributes).forEach(function(attribute) {
                    currentElement.setAttribute(attribute.name, attribute.value);
                });
            }
        });
    }

    _clearParentContainer() {
        this._parentElement.innerHTML = '';
    }

    /**
     * Create a spinner element and render it to the DOM
     */
    renderSpinner() {
        const markup = `
            <div class="spinner">
            <svg>
            <use href="${icons}#icon-loader"></use>
            </svg>
            </div>
        `;

        this._clearParentContainer();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    /**
     * Render an error message
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
            </div> -->
        `;
        
        this._clearParentContainer();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    /**
     * Render the message from the class if no parameter is used
     * @param {String} message 
     */
    renderMessage(message = this._message) {
        const markup = `
            <div class="message">
            <div>
                <svg>
                <use href="${icons}#icon-smile"></use>
                </svg>
            </div>
            <p>${message}</p>
            </div> -->
        `;
        
        this._clearParentContainer();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderElementHTML(temporaryParentElement, callback, clearParentContainer = true) {
        const originalParentElement = this._parentElement;
        this._parentElement = temporaryParentElement;

        const markup = typeof callback === 'function' ? callback() : '';
        
        if (clearParentContainer) {
            this._clearParentContainer();
        }

        this._parentElement.insertAdjacentHTML('afterbegin', markup);

        this._parentElement = originalParentElement;
    }
    
    /**
     * Render the generated markup to the DOM
     */
    renderMarkup() {
        const markup = this._generateMarkup();
        this._clearParentContainer();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
}