aSsearchAway is a movie search app I built to showcase my skills in creating web applications. It's designed to help users search and filter through a library of movies, all with a clean, simple and responsive UI.

Features:

- Real-Time Search: Powered by Meilisearch, results update dynamically as you type.
- Genre Filtering: Narrow down your search by selecting genres (dinamically created, as well).
- Sorting by Year: Latest-Older. Sort movies by their release year.
- Quick Previews: Hover over a movie to get a peek of its overview.
- Pagination: (on the way)

Tools:

- Front-end: Vanilla JavaScript, HTML, and Tailwind CSS.
- Search Engine: Meilisearch, providing fast and accurate search results.

This project demonstrates my ability to:

- Integrate third-party APIs and services (like Meilisearch).
- Build responsive and interactive web applications.

In order to get this working, clone the repo, then get meilisearch running locally and index the movies.json file as instructed here:
https://www.meilisearch.com/docs/learn/self_hosted/getting_started_with_self_hosted_meilisearch

In a separate bash console, use these curl put commands in order to make attributes sortable (by genre) and filterable (by year/release_date):

curl \
 -X PUT 'http://localhost:7700/indexes/movies/settings/filterable-attributes' \
 -H 'Content-Type: application/json' \
 --data-binary '[
"genres"
]'

curl \
 -X PUT 'http://localhost:7700/indexes/movies/settings/sortable-attributes' \
 -H 'Content-Type: application/json' \
 --data-binary '[
"release_date"
]'

If http://localhost:7700/indexes/movies/settings/ looks like this, you're good to start searching!:
{
"displayedAttributes": [
"*"
],
"searchableAttributes": [
"*"
],
"filterableAttributes": [
"genres"
],
"sortableAttributes": [
"release_date"
],
"rankingRules": [
"words",
"typo",
"proximity",
"attribute",
"sort",
"exactness"
],
"stopWords": [],
"nonSeparatorTokens": [],
"separatorTokens": [],
"dictionary": [],
"synonyms": {

},
"distinctAttribute": null,
"proximityPrecision": "byWord",
"typoTolerance": {
"enabled": true,
"minWordSizeForTypos": {
"oneTypo": 5,
"twoTypos": 9
},
"disableOnWords": [],
"disableOnAttributes": []
},
"faceting": {
"maxValuesPerFacet": 100,
"sortFacetValuesBy": {
"\*": "alpha"
}
},
"pagination": {
"maxTotalHits": 1000
},
"searchCutoffMs": null,
"localizedAttributes": null
}

---

Thanks for checking this out!
