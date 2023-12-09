class SearchView {
    _parentElement = document.querySelector('.search');

    getQuery() {
        const query = this._parentElement.querySelector('.search__field').value;
        this.clearInput();
        return query;
    }

    clearInput() {
        this._parentElement.querySelector('.search__field').value = '';
    }

    eventHandler(callback) {
        this._parentElement.addEventListener('submit', function(event) {
            event.preventDefault();
            callback();
        });
    }
}

export default new SearchView();