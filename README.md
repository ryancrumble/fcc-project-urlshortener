# URL Shortener Microservice

Built from the boilerplate code for the URL Shortener Microservice project. Instructions for building your project can be found at https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice.


## Requirements
- A POST route at `api/shorturl` that returns a JSON with the following structure:
  - ```{ original_url : 'https://freeCodeCamp.org', short_url : 1}```
- A GET route at `api/shorturl/<short_url>` that redirects to the original URL.
- Error handling:
  - **invalid url**: returns `{ error: 'invalid url' }`

## Implementation
The app requires a database to store the original_urls and short_urls.
When fetching the POST endpoint, a shortend url is generated and stored in the database.
When fetching the GET request, lookup the `short_url` in the database and return the `original_url` associated with it.