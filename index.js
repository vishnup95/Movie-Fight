import { generateAutoComplete } from './autocomplete.js';
import { fetchMovie } from './fetchMovie.js';

// DOM elements
const leftAutoComplete = document.querySelector('.left-autocomplete');
const rightAutoComplete = document.querySelector('.right-autocomplete');
const tutorial = document.querySelector('.info-section');
const leftMovieSummary = document.querySelector('.left-movie-summary');
const rightMovieSummary = document.querySelector('.right-movie-summary');

const autoCompletConfig = {
	renderOption(movie) {
		return `<img src=${movie.Poster === 'N/A'
			? 'https://www.reelviews.net/resources/img/default_poster.jpg'
			: movie.Poster
			} alt=${movie.Title}/><p class="movie-name">${movie.Title}</p>`;
	},
	searchFunction(...args) {
		return fetchMovie(...args)
	},
	onInputSelect(movie) {
		return movie.Title
	},
	optionsLoop: "Search"
}

generateAutoComplete({
	root: leftAutoComplete,
	onOptionSelect(movie) {
		onMovieSelect(movie, leftMovieSummary, 'left')
	},
	...autoCompletConfig
});

generateAutoComplete({
	root: rightAutoComplete,
	onOptionSelect(movie) {
		onMovieSelect(movie, rightMovieSummary, 'right')
	},
	...autoCompletConfig
});

const renderMovieDetails = (movieData) => {
	tutorial.style.display = "none";

	const dollarValue = Number(movieData.BoxOffice.replace(/[^0-9.-]+/g, ""));
	const metaScoreValue = Number(movieData.Metascore);
	const imdbRating = Number(movieData.imdbRating);

	// For now, for awards. We are going to count the numbers in the Award string. 
	// E.G: Nominated for 7 Oscars. 21 wins & 43 nominations total
	// Would lead to 21+7+43 = 71 count in awards.

	// const awardCount = movieData.Awards.split(" ").reduce((prev, curr) => {
	// 	const parsedValue = parseInt(curr, 10);

	// 	if (Number.isNaN(parsedValue)) {
	// 		return prev;
	// 	} else {
	// 		return prev + parsedValue
	// 	}

	// }, 0);

	const awardCount = movieData.Awards.match(/\d+/g).reduce((acc, curr) => { return Number(acc) + Number(curr) }, 0)


	return `<article class="media mb-4">
	<figure class="media-left">
		<p class="image">
			<img src=${movieData.Poster} alt=${movieData.Title} />
		</p>
	</figure>
	<div class="media-content">
   		<div class="content">
      		<div>
        		<h1>${movieData.Title}</h1> 
        		<h4>${movieData.Genre}</h4>
        		<p>${movieData.Plot}</p>
      		</div>
    	</div>
	</div>
	</article>
	<div class="tile is-ancestor">
	 <div class="is-12 tile is-vertical is-parent">
	 	<div class="tile is-child box" data-value=${awardCount}>
	 		<p class="subtitle">Awards:</p>
		 	<p class="title">${movieData.Awards}</p>
	 	</div>
		<div class="tile is-child box" data-value=${imdbRating}>
			<p class="subtitle">IMDB Rating:</p>
		 	<p class="title">
	 	  	 ${movieData.imdbRating}/10
		 	</p>
	 	</div>
		<div class="tile is-child box" data-value=${metaScoreValue}>
			<p class="subtitle"> MetaCritic Score: </p> 
			<p class="title">
		 	 ${movieData.Metascore}/100
			</p>
		</div>
		<div class="tile is-child box" data-value=${dollarValue}>
			<p class="subtitle"> Box Office Collection:</p>
			<p class="title">${movieData.BoxOffice}</p>
	 	</div>
	 </div>
	</div>`
};

let rightData, leftData;
export const onMovieSelect = async (movie, summaryNode, rightOrLeft) => {
	const movieData = await fetchMovie(movie.imdbID, "i");
	summaryNode.innerHTML = renderMovieDetails(movieData)
	if (rightOrLeft === 'left') {
		leftData = movieData
	} else {
		rightData = movieData;
	}
	if (rightData && leftData) startCompare()
}

export const startCompare = () => {
	const leftSideElements = leftMovieSummary.querySelectorAll('.box');
	const rightSideElements = rightMovieSummary.querySelectorAll('.box');

	leftSideElements.forEach((leftElement, idx) => {
		let rightElement = rightSideElements[idx];
		compareAndSet(leftElement, rightElement)
	})
}

function compareAndSet(leftElement, rightElement) {
	if (+leftElement.dataset.value > +rightElement.dataset.value) {
		leftElement.classList.add('has-background-success')
	} else {
		rightElement.classList.add('has-background-success')
	}
}