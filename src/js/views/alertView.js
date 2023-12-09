import icons from 'url:../../img/icons.svg';
import $ from 'jquery';
import View from './View.js';

class AlertView extends View{
    _parentElement = document.querySelector('.recipe');

    _addHandlerClickConfirm(handler) {
      $('.btn-confirm').on('click', function() {
        handler();
      });
    }

    _addHandlerClickCancel(handler) {
      $('.btn-cancel').on('click', function() {
        handler();
      });
    }

    render(message, confirmCallback, cancelCallback) {
        const markup = this._generateMarkup(message);
        this._parentElement.insertAdjacentHTML('afterbegin', markup);

        this._addHandlerClickConfirm(confirmCallback);
        this._addHandlerClickCancel(cancelCallback)

    }
    _generateMarkup(message) {
        return `
        <div class="alert-top">
          <div class="alert-wrapper">
            <div class="alert-page-overlay"></div>
            <div class="alert-confirmation">
              <div class="alert">
                <div class="flex">
                  <div class="indicator">
                    <svg>
                      <use href="${icons}#icon-alert-circle"></use>
                    </svg>
                  </div>
                  <p class="text">${message}</p>
                </div>
                <div class="flex alert-buttons">
                  <a class="confirmation-btn btn-cancel">CANCEL</a>
                  <a class="confirmation-btn btn-confirm">CONFIRM</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
}

export default new AlertView();