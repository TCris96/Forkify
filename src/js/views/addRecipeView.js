import View from './View.js';
import $ from 'jquery';
import icons from 'url:../../img/icons.svg'; 

class AddRecipeView extends View{
    _message = 'Recipe successfully uploaded!';
    _parentElement = document.querySelector('.upload');
    _windowElement = $('.add-recipe-window');
    _overlayElement = $('.overlay');
    _addRecipeButton = $('.nav__btn--add-recipe');
    _closeModalButton = $('.btn--close-modal');

    numberOfIngredients = 6;

    constructor() {
        super();
        this._addHandlerAddRecipe();
        this._addHandlerCloseModal();
    }

    toggleOverlay() {
        $(this._windowElement).toggleClass('hidden');
        $(this._overlayElement).toggleClass('hidden');
    }

    _addHandlerAddRecipe() {
        $(this._addRecipeButton).on('click', this._prepareUploadForm.bind(this));
    }

    _addHandlerCloseModal() {
        $(this._closeModalButton).on('click', this.toggleOverlay.bind(this));
        $(this._overlayElement).on('click', this.toggleOverlay.bind(this));
    }

    addHandlerAddRecipe(handler) {
        this._parentElement.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = [...new FormData(this)];
            console.log(formData);
            const data = Object.fromEntries(formData);
            console.log(data);

            handler(data);
        });
    }

    _prepareUploadForm() {
        this.toggleOverlay();
        this._renderForm();
        this._attachEventListeners();
    }
    
    _attachEventListeners() {
        const inputsParent = $('[data-name="ingredients"]');
        const inputs = inputsParent.find(':input');

        //Arrow function is used to not override the this keyword
        inputs.each((index, input) => {
            $(input).on('blur', () => {
                this.validateInput($(input));
            });
        });
    }
    
    validateInput(input) {
        console.log('exit')
        const inputDataName = $(input).data('name');
        const warningElement = $(input).closest('.ingredient-details').find('.warning--message');
        console.log(warningElement)

        if (inputDataName === 'quantity') {
            const inputValue = parseFloat($(input).val());
            const wrongFormat = Number.isNaN(inputValue);

            $(input).toggleClass('warning', wrongFormat);
            $(warningElement).toggleClass('hidden', !wrongFormat);
        }
    }

    _renderForm() {
        this._clearParentContainer();
        this._renderUploadButton();
        this._renderFormStructure();
        this._renderRecipeDetails();
        this._renderIngredients();
    }

    _renderFormStructure() {
        const temporaryParentElement = this._parentElement;

        this.renderElementHTML(temporaryParentElement, this._generateFormStructureMarkup.bind(this), false);
    }

    _renderRecipeDetails() {
        const temporaryParentElement = document.querySelector('[data-name="recipe-details"]');

        this.renderElementHTML(temporaryParentElement, this._generateRecipeDetailsMarkup.bind(this));
    }

    _renderIngredients() {
        const temporaryParentElement = document.querySelector('[data-name="ingredients"]');
      
        this.renderElementHTML(temporaryParentElement, this._generateIngredientsMarkup.bind(this));
    }
    
    _renderUploadButton() {
        const temporaryParentElement = this._parentElement;
      
        this.renderElementHTML(temporaryParentElement, this._generateUploadButtonMarkup.bind(this), false);
    }

    _clearUploadForm() {
        this._clearParentContainer();
        this._renderIngredients();
    }

    _generateUploadButtonMarkup() {
        return `
            <button class="btn upload__btn">
                <svg>
                    <use href="${icons}#icon-upload-cloud"></use>
                </svg>
                <span>Upload</span>
            </button>
        `;
    }

    _generateFormStructureMarkup() {
        return `
            <div class="upload__column" data-name="recipe-details"></div>
            <div class="upload__column" data-name="ingredients"></div>
        `;
    }

    _generateRecipeDetailsMarkup() {
        return `
            <h3 class="upload__heading">Recipe data</h3>
            <label>Title</label>
            <input value="TEST23" required name="title" type="text" />
            <label>URL</label>
            <input value="TEST23" required name="sourceUrl" type="text" />
            <label>Image URL</label>
            <input value="TEST23" required name="image" type="text" />
            <label>Publisher</label>
            <input value="TEST23" required name="publisher" type="text" />
            <label>Prep time</label>
            <input value="23" required name="cookingTime" type="number" />
            <label>Servings</label>
            <input value="23" required name="servings" type="number" />
            </div>
        `;
    }    

    _generateIngredientsMarkup() {
        let markup = '<h3 class="upload__heading">Ingredients</h3>';

        for (let i = 1; i <= this.numberOfIngredients; i++) {
            markup += this._generateIngredientMarkup(i);
        }

        return markup;
    }

    _generateIngredientMarkup(ingredientNo) {
        const name = `ingredient-${ingredientNo}`;
        return `
        <label>Ingredient ${ingredientNo}</label>
        <div class="ingredient-details">
          <div class="quantity">
            <label>Quantity</label>
            <input value="0.5" type="text" name="${name}_quantity" data-name="quantity">
          </div>
          <div class="unit">
            <label>Unit</label>
            <input value="kg" type="text" name="${name}_unit" data-name="unit">
          </div>
          <div class="description">
            <label>Description</label>
            <input value="Rice" type="text" name="${name}_description" data-name="description">
          </div>
          <div class="warning--message hidden">
            <svg class="warning-icon">
                <use href="${icons}#icon-alert-circle"></use>
            </svg>
            Wrong format! The quantity must be a number!
          </div>
        </div>
        `;
    }
}

export default new AddRecipeView();