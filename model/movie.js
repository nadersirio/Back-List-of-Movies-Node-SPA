const { v4: uuidv4 } = require('uuid');

const {
  getDatabase,
  saveDatabase,
} = require("../model/index.js");

function createPoster(database) {
  database.poster = {}
  return saveDatabase(database);
}

function searchMovie(param) {
  const database = getDatabase();
  for (let movieHash in database.poster) {
    if(database.poster[movieHash].title.toLowerCase() == param.toLowerCase()) {
      return movieHash;
    }
  }
}

function hashCheckDatabase(hashNewMovie) {
  const database = getDatabase();
  return database.poster[hashNewMovie];
}

function titleCheckDataBase(newMovie) {
  const database = getDatabase();
  for(let movie in database.poster) {
    if(database.poster[movie].title.toLowerCase() === newMovie.title.toLowerCase()) {
      return database.poster[movie].title;
    }
  }
}

function getAllMovies() {
  const cartaz = getDatabase().poster;

  const movies = []
  for (slug in cartaz) {
    const movie = cartaz[slug];
    movies.push({ ...movie, slug });
  }
  return movies;
}

function saveMovie(newMovie) {
  const hash = uuidv4();
  const database = getDatabase() || {}
  const currentPoster = database.poster[hash] || {}

  database.poster[hash] = {
    ...currentPoster,
    title: newMovie.title,
    url: newMovie.url,
    release: newMovie.release,
  }
  saveDatabase(database)
  return hash;
}

function editMovie(body){
  const database = getDatabase();
  const currentPoster = database.poster[body.slug] = {}

  database.poster[body.slug] = {
    ...currentPoster,
    title: body.movie.title,
    url: body.movie.url,
    release: body.movie.release,
  }
  saveDatabase(database)
  return body.slug;
}

module.exports = {
  createPoster,
  searchMovie,
  hashCheckDatabase,
  titleCheckDataBase,
  getAllMovies,
  saveMovie,
  editMovie,
}