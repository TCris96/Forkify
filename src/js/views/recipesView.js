import View from './View.js';
import previewView from './previewView.js';

class RecipesView extends View{
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found. Please try again!';
    _message = '';

    _generateMarkup() {
        return this._data.map(previewView._generateMarkupPreview).join('');
    }
}

export default new RecipesView();