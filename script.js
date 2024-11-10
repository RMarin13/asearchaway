const client = new MeiliSearch({
  host: "http://127.0.0.1:7700",
});

const searchInput = document.getElementById("search");
const filtersContainer = document.getElementById("filters-container");
const moviesWrapper = document.getElementById("movies-wrapper");
const sortSelector = document.getElementById("sort-selector");

const moviesWrapperPlaceholder = `
  <div class="col-span-2 flex flex-col items-center justify-center h-full text-center space-y-4">
    <h2 class="text-3xl font-bold text-gray-500">Ready to Explore Movies?</h2>
    <p class="text-xl text-gray-400">Type in the search box to discover your next favorite movie!</p>
    
  </div>
  `;
if (searchInput.value.trim() === "") {
  moviesWrapper.innerHTML = moviesWrapperPlaceholder;
}

let currentQuery = "";
let selectedGenres = [];
let currentSort = "desc";

searchInput.addEventListener("input", (event) => {
  currentQuery = event.target.value.trim();
  if (currentQuery === "") {
    moviesWrapper.innerHTML = moviesWrapperPlaceholder;
    return;
  }
  searchAndFilter();
});

filtersContainer.addEventListener("change", (event) => {
  if (event.target.type === "checkbox") {
    const genre = event.target.id;
    if (event.target.checked) {
      selectedGenres.push(genre);
    } else {
      selectedGenres = selectedGenres.filter((gen) => gen !== genre);
    }
    searchAndFilter();
  }
});

sortSelector.addEventListener("change", (event) => {
  currentSort = event.target.value;
  searchAndFilter();
});

async function searchAndFilter() {
  try {
    const filterArray = selectedGenres.length
      ? selectedGenres.map((genre) => `genres = "${genre}"`)
      : [];

    const searchOptions = {
      filter: filterArray.length > 0 ? [filterArray] : undefined,
      sort: [`release_date:${currentSort}`],
      hitsPerPage: 24,
    };

    const res = await client
      .index("movies")
      .search(currentQuery, searchOptions);

    let movies = res.hits;

    moviesWrapper.innerHTML = "";

    movies.forEach((movie) => {
      const movieElement = createMovieElement(movie);
      moviesWrapper.appendChild(movieElement);
    });

    updateGenres(movies);
  } catch (error) {
    console.error("Search error:", error);
  }
}

function createMovieElement(movie) {
  const movieElement = document.createElement("div");

  movieElement.className = "item space-y-2 ";
  movieElement.innerHTML = `
      <div
        class="bg-gray-100 flex justify-center overflow-hidden group cursor-pointer border rounded-xl group relative"
      >
        <img
          src="${movie.poster}"
          alt="${movie.title}"
          class="w-full h-full object-cover"
        />
        <div
          class="absolute inset-0 bg-black bg-opacity-75 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
        >
          <p class="text-sm">${movie.overview || "No overview available"}</p>
        </div>
      </div>
      <p class="text-xl">${movie.title}</p>
      <p>Released: ${retrieveYear(movie.release_date)}</p>
    `;
  return movieElement;
}

function updateGenres(movies) {
  const allGenres = new Set();
  movies.forEach((movie) => {
    movie.genres.forEach((genre) => allGenres.add(genre));
  });

  filtersContainer.innerHTML = "";
  Array.from(allGenres)
    .sort()
    .forEach((genre) => {
      const genreElement = createGenreElement(
        genre,
        selectedGenres.includes(genre.toLowerCase())
      );
      filtersContainer.appendChild(genreElement);
    });
}

function retrieveYear(unix) {
  const date = new Date(unix * 1000);
  return date.getFullYear();
}

function createGenreElement(genre, isChecked) {
  const genreElement = document.createElement("div");
  genreElement.className = "check";
  genreElement.innerHTML = `
      <div>
        <input type="checkbox" id="${genre.toLowerCase()}" ${
    isChecked ? "checked" : ""
  } />
        <label for="${genre.toLowerCase()}">${genre}</label>
      </div>
    `;
  return genreElement;
}
