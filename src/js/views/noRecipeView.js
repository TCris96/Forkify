
import icons from 'url:../../img/icons.svg';
import View from './View.js'

class NoRecipeView extends View{
    _parentElement = document.querySelector('.recipe');

    _generateMarkup() {
        return `
        <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>Start by searching for a recipe or an ingredient. Have fun!</p>
        </div>
      `;
    }
}

export default new NoRecipeView();