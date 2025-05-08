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
}
