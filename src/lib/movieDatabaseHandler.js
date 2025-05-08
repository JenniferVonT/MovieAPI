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
   * Fetch an actor by their full name.
   *
   * @param {string} name - The actors full name.
   * @returns {object} - The actor object.
   */
  async getActorByName (name) {
    // Make the query case insensitive by making the search in uppercase.
    const query = 'SELECT * FROM Actor WHERE UPPER(name) = UPPER(?)'
    const [actor] = await db.execute(query, [name])

    if (actor.length === 0) {
      throw new Error('That actor does not exist in this database')
    }

    return actor
  }

  /**
   * Fetches all the roles associated with an actor.
   *
   * @param {string} id - The actor id.
   * @returns {Array} An array with all the roles
   */
  async getAllRoles (id) {
    // Fetch all the actors roles.
    const query = 'SELECT * FROM Role WHERE actor_id = ?'
    const roles = await db.execute(query, [id])

    return roles[0]
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
    const movieQ = 'INSERT INTO Movie (id, title, release_year, description, poster_path) VALUES (?,?,?,?,?)'

    await db.execute(movieQ, [movieID, title, releaseYear, null, null])

    // Create the genres if neccessary.
    const checkGenre = await this.hasGenre(genre)

    if (!checkGenre) {
      await this.createGenre(genre)
      await this.createMovieHasGenre(genre, movieID)
    } else {
      await this.createMovieHasGenre(genre, movieID)
    }
  }

  /**
   * Updates an existing movie in the database.
   *
   * @param {string} id - Movie id.
   * @param {string} title - Movie title.
   * @param {string} description - Movie desc.
   * @param {string} releaseYear - Movie release year.
   * @param {string} genre - Movie genre.
   */
  async updateMovie (id, title, description, releaseYear, genre) {
    let error

    // If id is missing throw an error.
    if (!id) {
      error = new Error('Invalid id')
      throw error
    }

    // Check which attributes are present and build the query accordingly.
    const fields = []
    const values = []

    if (typeof title !== 'undefined') {
      fields.push('title = ?')
      values.push(title)
    }

    if (typeof description !== 'undefined') {
      fields.push('description = ?')
      values.push(description)
    }

    if (typeof releaseYear !== 'undefined') {
      fields.push('release_year = ?')
      values.push(releaseYear)
    }

    if (typeof genre !== 'undefined') {
      // If the genre already exists...
      const doesGenreExist = await this.hasGenre(genre)

      if (doesGenreExist) {
        // .. but doesn't have a movie connection, create the connection.
        const connection = await this.hasMovieGenreConnection(genre, id)

        if (!connection) {
          await this.createMovieHasGenre(genre, id)
        }
      } else {
        // Otherwise create the genre and connection.
        await this.createGenre(genre)
        await this.createMovieHasGenre(genre, id)
      }
    }

    // Lastly update the movie entity.
    if (fields.length !== 0) {
      const updateMovieQuery = `UPDATE Movie SET ${fields.join(', ')} WHERE id = ?`

      values.push(id)

      await db.execute(updateMovieQuery, values)
    }
  }

  /**
   * Deletes a movie from the database.
   *
   * @param {string} id - The movie id.
   */
  async deleteMovie (id) {
    // Delete the movie.
    const query = 'DELETE FROM Movie WHERE id = ?'
    const [result] = await db.execute(query, [id])

    // Check if the movie table was affected or not.
    if (result.affectedRows === 0) {
      throw new Error('Something went wrong, could not delete movie')
    }
  }

  /**
   * Verifies if a genre already exists or not.
   *
   * @param {string} genre - The genre name.
   * @returns {boolean} - True if it exists, False if not.
   */
  async hasGenre (genre) {
    // Check if it is a new genre.
    const genreQ = 'SELECT * FROM Genre WHERE UPPER(name) = UPPER(?)'
    const [genreResult] = await db.execute(genreQ, [genre])

    // If it doesn't already exist return false.
    if (genreResult.length === 0) {
      return false
    } else {
      return true
    }
  }

  /**
   * Creates a genre entity in the database.
   *
   * @param {string} genre - name of the genre
   */
  async createGenre (genre) {
    // First create a unique ID.
    const idGenreQuery = 'SELECT MAX(id) AS max_id FROM Genre'
    const [result] = await db.execute(idGenreQuery)
    const maxID = result[0].max_id || 0 // If no rows, default to 0
    const genreID = maxID + 1 // Increment ID.

    // Create Genre row.
    const createGenreQ = 'INSERT INTO Genre (id, name) VALUES (?,?)'
    await db.execute(createGenreQ, [genreID, genre])
  }

  /**
   * Check if the Movie_has_Genre entity exists.
   *
   * @param {string} genre - Genres name.
   * @param {string} movieID - Movies unique id.
   * @returns {boolean} - True if it exist, False if it don't
   */
  async hasMovieGenreConnection (genre, movieID) {
    const genreQ = 'SELECT * FROM Genre WHERE UPPER(name) = UPPER(?)'
    const [genreID] = await db.execute(genreQ, [genre])

    const query = 'SELECT * FROM Movie_has_Genre WHERE genre_id = ? AND movie_id = ?'
    const [result] = await db.execute(query, [genreID[0].id, movieID])

    // If it doesn't exist return false, otherwise true.
    if (result.length === 0) {
      return false
    } else {
      return true
    }
  }

  /**
   * Create the connected entity between movies and genres in the db.
   *
   * @param {string} genre - Name of the genre.
   * @param {string} movieID - The connected movies unique id.
   */
  async createMovieHasGenre (genre, movieID) {
    // Get the genre id.
    const idQuery = 'SELECT id FROM Genre WHERE UPPER(name) = UPPER(?)'
    const [genreID] = await db.execute(idQuery, [genre])

    // Create a Movie_has_Genre entity.
    const MhGQuery = 'INSERT INTO Movie_has_Genre (genre_id, movie_id) VALUE (?,?)'
    await db.execute(MhGQuery, [genreID[0].id, movieID])
  }

  /**
   * Fetches all the ratings for a movie.
   *
   * @param {string} id - The movie id.
   * @returns {object} - An array of all the ratings.
   */
  async getAllRatings (id) {
    // Get all ratings connected to the movie id.
    const query = 'SELECT * FROM rating WHERE movie_id = ?'
    const [result] = await db.execute(query, [id])

    if (result.length === 0) {
      throw new Error('That movie does not exist or there is no ratings for that movie yet!')
    }

    // Calculate the average score and extract the individual ratings.
    let total = 0
    const ratings = []

    result.forEach(res => {
      // Make sure that the number is a number and not a string.
      const num = parseFloat(res.rating)

      if (!isNaN(num)) {
        total += num
        ratings.push(num)
      }
    })

    const average = parseFloat((total / ratings.length).toFixed(1))

    const resultObj = {
      average,
      allRatings: ratings
    }

    return resultObj
  }
}
