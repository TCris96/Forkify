import icons from 'url:../../img/icons.svg'; //Parcel 2
import View from './View.js'

class PaginationView extends View{
    _parentElement = document.querySelector('.pagination')

    eventHandler(callback) {
        this._parentElement.addEventListener('click', function(event) {
            const btn = event.target.closest('.btn--inline');
            console.log(btn);

            if (!btn) {
                return;
            }

            const pageNo = +btn.dataset.goto;
            callback(pageNo);
        });
      }

    _generateMarkup() {
        const currentPage = this._data.page;
        const numOfPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        console.log(numOfPages)

        if (currentPage === 1 && currentPage < numOfPages) {
            return this._generatePaginationElement('next', 'right', currentPage + 1);
        }

        if (currentPage !== numOfPages && currentPage < numOfPages) {
            return this._generatePaginationElement('prev', 'left', currentPage - 1) +
                this._generateTotalPagesNoElement(numOfPages) +
                this._generatePaginationElement('next', 'right', currentPage + 1);   
        }

        if (currentPage === numOfPages && numOfPages > 1) {
            return this._generatePaginationElement('prev', 'left', currentPage - 1);
        }

        return '';
    }

    _generatePaginationElement(btnDirection, arrowDirection, currentPage) {
        return `
        <button class="btn--inline pagination__btn--${btnDirection}" data-goto="${currentPage}">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-${arrowDirection}"></use>
            </svg>
            <span>Page ${currentPage}</span>
        </button>
        `;
    }

    _generateTotalPagesNoElement(totalPages) {
        return `
        <button class="btn--inline">
            <span>${totalPages}</span>
        </button>
        `;
    }
}

export default new PaginationView();