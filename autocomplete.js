// destructuring functions so they can be used
const createAutoComplete = ({
   root,
   renderOption, 
   onOptionSelect, 
   inputValue,
  fetchData
  }) => {
    // html content render to page
    console.log(root)
root.innerHTML = `
  <label><b>search </b></label>
  <input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
    <div class="dropdown-content results"></div>
    </div>
  </div>
`;

// selectors input, dropdown, results(html)
// root is accessable from index page through destructuring in above function
const input = root.querySelector('input');
const dropdown = root.querySelector('.dropdown');
const resultsWrapper = root.querySelector('.results');


// runs when user enters text
const onInput = async event => {
  // get the entered value and passing to the fetchdata api call  
  const items = await fetchData(event.target.value) ;
  // if no search hide dropdown menu
  if(!items.length){
    // remove active class from dropdown menu
    dropdown.classList.remove('is-active');
    return;
  }
  // Clear search bar
  resultsWrapper.innerHTML = '';
  // open up the dropdown menu
  dropdown.classList.add('is-active');

  //  loop over the array retuned from the API
  for (const item of items) {
    // create an anchor for each movie
    const option = document.createElement('a');


    // add class to each movie
    option.classList.add('dropdown-item');
    // change the option html to with api data and html
    option.innerHTML = renderOption(item);
    // event listener to clicked movie
    option.addEventListener('click', () => {
      dropdown.classList.remove('is-active');
      input.value = inputValue(item);
      // helper function
      onOptionSelect(item);
    })

    // adding the movies to the page
    resultsWrapper.appendChild(option);
  }
};

// debounc func will make the code only runs once after a second has passed
input.addEventListener('input', debounce(onInput, 500));

// global event listener
document.addEventListener('click', event => {
  // check if user clicked outside the drop down menu root contains dropdown html
    if (!root.contains(event.target)) {
      // close dropdown by removing class
      dropdown.classList.remove('is-active');
    }
  })
};