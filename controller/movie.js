const { request } = require("express");
const express = require("express");
const serverRouteMovie = express.Router();

const {
  getDatabase,
  saveDatabase,
} = require("../model/index.js");

const {
  createPoster,
  searchMovie,
  hashCheckDatabase,
  titleCheckDataBase,
  getAllMovies,
  saveMovie,
  editMovie,
} = require("../model/movie.js");

serverRouteMovie.get("/poster", (req, res) => {
  if(req?.query?.search) {
    const params = req.query.search;
    const getMovieHash = searchMovie(params);

    if(getMovieHash) {
      const slug = getMovieHash;
      const movie = getDatabase().poster[slug];
      return res.status(302).json({ movie, slug });
    }
    return res.status(404).json({ error: "Movie not Found." });
  }
  const listMovies = getAllMovies();
  if(listMovies.length === 0) {
    return res.status(404).json({ error: "Library Empty" });
  }
  return res.json(listMovies);
})

serverRouteMovie.post("/new-movie", (req, res) => {
  const newMovie = req.body.movie;
  const hashNewMovie = req.body.slug;
  if(!req.body.cookies.user) {
    return res.status(401).json({ error: "not autorizated" });
  }

  const database = getDatabase();
  if(!database.poster) {
    createPoster(database);
  }

  const hashExist = hashCheckDatabase(hashNewMovie);
  const titleExist = titleCheckDataBase(newMovie);
  if(hashExist) {
    if(hashExist.title === titleExist || !titleExist) {
      const hashEditedMovie = editMovie(req.body);
      return res.status(200).setHeader('id', hashEditedMovie).json(hashEditedMovie);
    }
    if(!hashExist[titleExist]) {
      res.status(405).json({ error: "movie exist" });
    }
  }
  if(titleExist) {
    return res.status(405).json({ error: "title exist" });
  }
  const hashCreatedMovie = saveMovie(newMovie);
  return res.status(201).setHeader('id', hashCreatedMovie).json(hashCreatedMovie);
})

serverRouteMovie.get("/movie/:nameMovie", (req, res) => {
  const name = req.params.nameMovie.toLowerCase();
  const movieHash = searchMovie(name);
  const movie = getDatabase().poster[movieHash];
  if (!movie) {
    return res.status(404).send({ error: "Movie not Found." });
  }
  return res.status(200).json({movie, movieHash});
});

serverRouteMovie.delete("/movie/:delete", (req, res) => {
  const slug = req.params.delete;
  const database = getDatabase();
  delete database.poster[slug];
  saveDatabase(database);
  res.status(200).json({});
})

module.exports = {
  serverRouteMovie,
}