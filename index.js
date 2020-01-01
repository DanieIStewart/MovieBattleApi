// config
const autocompleteConfig = {
    // dropdown functionality
    renderOption(movie){
      // check that the src is not N/A movie is every individual movie on the drop down
      const imgSrc = movie.Poster === 'N/A' ? '': movie.Poster;
      return `
      <img src="${imgSrc}" />
      ${movie.Title} (${movie.Year})
       `},
    // input field value after user selects a movie
    inputValue(movie){
      return movie.Title;
    },
    //fetch data api call with input data from user
    async fetchData(searchTerm){
      const response = await axios.get('http://www.omdbapi.com/', {
          params:{
              apikey: 'a3547f37',
              s: searchTerm
          }
      });
      // check if the responce has an error if not return the search data
      return (response.data.Error ? [] : response.data.Search);
        }
}
// render left handside movie details
createAutoComplete({
  ...autocompleteConfig,
  root: document.querySelector('#left-autocomplete'),
      // user selects a movie
      onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden')
        // passing in the selected movie, where to render, the side
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
      }

});

// render Right handside movie details
createAutoComplete({
  ...autocompleteConfig,
  root: document.querySelector('#right-autocomplete'),
    // user selects a movie
    onOptionSelect(movie){
      document.querySelector('.tutorial').classList.add('is-hidden')
      // passing in the selected movie, where to render, the side
      onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }
});

let leftMovie;
let rightMovie;

// When a movie is selected we request more data from API
const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params:{
        apikey: 'a3547f37',
        i: movie.imdbID
    }
  });
  // pass the selected movie details from api to helper function that will create html
  summaryElement.innerHTML = movieTemplate(response.data);

  // confirm the side
  if(side === 'left'){
    leftMovie = response.data
  }else{
    rightMovie = response.data
  }
  // if both movies are defined run comparison
  if(leftMovie && rightMovie){
    runComparison();
  }
}

const runComparison= () => {
  const leftSideStats = document.querySelectorAll('#left-summary .notification');
  const rightSideStats = document.querySelectorAll('#right-summary .notification');

  leftSideStats.forEach((leftStat, index) => {
  const rightStat= rightSideStats[index];
  
  const leftSideValue = parseInt(leftStat.dataset.value);
  const rightSideValue = parseInt(rightStat.dataset.value);
  const body= document.querySelector('body')

  if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
  }else{
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
    }
  });
};

// HTML Template for the movie
const movieTemplate = movieDetail => {
  // use replace to remove $ and , from the returned string
  const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

  const awards =  movieDetail.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word);

    if(isNaN(value)){
      return prev;
    }else{
      return prev + value;
    }
  }, 0);

  console.log(awards)

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice === 'N/A' ? 'Not available' : movieDetail.BoxOffice }</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};