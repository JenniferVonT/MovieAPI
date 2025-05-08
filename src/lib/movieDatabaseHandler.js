/**
 * @file  Provides functions to the movie portion of the database.
 * @module lib/movieDatabaseHandler
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 * @version 1.0.0
 */

import { db } from '../config/dbsettings.js'

/**
 * A database handler class.
 */
export class MovieDatabaseHandler {
  /**
   * Gets all movies.
   *
   * @returns {Array} the movie objects.
   */
  async getAllMovies () {
    // Create query and fetch.
    const query = 'SELECT * FROM Movie'

    const movies = await db.execute(query)

    return movies
  }

  /**
   * Gets all actors.
   *
   * @returns {Array} the actor objects.
   */
  async getAllActors () {
    // Create query and fetch.
    const query = 'SELECT * FROM Actor'

    const actors = await db.execute(query)

    return actors
  }

  /**
   * Get a movie by its id.
   *
   * @param {string} id - movie id.
   * @returns {object} - Movie object.
   */
  async getMovieByID (id) {
    const query = 'SELECT * FROM Movie WHERE id = ?'

    const movie = await db.execute(query, [id])
    return movie[0]
  }

  /**
   * Add a movie to the database.
   *
   * @param {string} title - Movie title.
   * @param {string} releaseYear - Year when movie was released.
   * @param {string} genre - Movie Genre.
   */
  async addMovie (title, releaseYear, genre) {
    // First create a unique ID.
    const idQuery = 'SELECT MAX(id) AS max_id FROM Movie'
    const [result] = await db.execute(idQuery)
    const maxID = result[0].max_id || 0 // If no rows, default to 0
    const movieID = maxID + 1 // Increment ID.

    // Create movie in db.
    const movieQ = 'INSERT INTO Movie (id, Title, Release_year, Description, poster_path) VALUES (?,?,?,?,?)'

    await db.execute(movieQ, [movieID, title, releaseYear, null, null])

    // Check if it is a new genre.
    const genreQ = 'SELECT * FROM Genre WHERE UPPER(name) = UPPER(?)'
    const [genreResult] = await db.execute(genreQ, [genre])

    let genreID

    // If it doesn't already exist create it.
    if (genreResult.length === 0) {
      // First create a unique ID.
      const idGenreQuery = 'SELECT MAX(id) AS max_id FROM Genre'
      const [result] = await db.execute(idGenreQuery)
      const maxID = result[0].max_id || 0 // If no rows, default to 0
      genreID = maxID + 1 // Increment ID.

      // Create Genre row.
      const createGenreQ = 'INSERT INTO Genre (id, name) VALUES (?,?)'
      await db.execute(createGenreQ, [genreID, genre])
    } else {
      genreID = genreResult[0].id
    }

    // Create Movie_has_Genre entitiy.
    const MhGQuery = 'INSERT INTO Movie_has_Genre (Genre_ID, Movie_ID) VALUE (?,?)'
    await db.execute(MhGQuery, [genreID, movieID])
  }
}
