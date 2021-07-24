import { debounce } from "./utils.js";

/**
 * Generate AutoComplete code.
 * @function generateAutoComplete
 * @param {Object} config - The Autocomplete config.
 * @param {Element} config.root - The DOM node to render the autocomplete to.
 * @param {renderOptionCB} config.renderOption - A function that must return the HTML for autocomplete options.
 * @param {searchFunctionCB} config.searchFunction - A function to search items. 
 * @param {optionSelectCB} config.onOptionSelect - A function that handles selection of option. Gives you the indvidual option
 * @param {inputSelectCB} config.onInputSelect -  A function that returns the input box content on selection. provides the indivual option
 * @param {optionsLoop} config.optionsLoop - A key for the values to loop through. Leave it empty to loop through the response of searchFunction as is.
 */

export const generateAutoComplete = ({ root, renderOption, searchFunction, onOptionSelect, onInputSelect, optionsLoop = "Search" }) => {
    root.innerHTML = `
<label for="autocomplete-search">Search Here
:</label>
<input type="text" placeholder="Search" class="input is-primary is-medium"/>
<div class="dropdown">
  <div class="dropdown-menu" id="dropdown-menu" role="menu">
    <div class="dropdown-content results">
    </div>
  </div>
</div>
`;

    const autoCompleteSearch = root.querySelector('input');
    const autoCompleteResults = root.querySelector('.results');
    const dropdown = root.querySelector('.dropdown');


    const fetchOptions = async (e) => {
        const items = await searchFunction(e.target.value, 's');

        if (Array.isArray(items)) {
            // No data
            dropdown.classList.remove('is-active');
            return;
        }

        const loopValue = optionsLoop ? items[optionsLoop] : items;

        autoCompleteResults.innerHTML = '';
        dropdown.classList.add('is-active');

        for (let item of loopValue) {
            let option = document.createElement('a');
            option.innerHTML = renderOption(item)

            option.addEventListener('click', async (event) => {
                dropdown.classList.remove('is-active');
                autoCompleteSearch.value = onInputSelect(item)
                onOptionSelect(item);
            });

            option.classList.add('dropdown-item');
            autoCompleteResults.appendChild(option);
        }
    };


    autoCompleteSearch.addEventListener('input', debounce(fetchOptions));

    document.addEventListener('click', (event) => {
        if (!event.composedPath().includes(root)) {
            dropdown.classList.remove('is-active');
        }
    });

}