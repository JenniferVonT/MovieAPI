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
   * Gets all movies with pagination.
   *
   * @param {number} limit - The amount of movies to fetch.
   * @param {number} offset - The offset (page)
   * @returns {Array} the movie objects.
   */
  async getMovies (limit = 2000, offset = 1) {
    const query = `
                    SELECT m.*, g.name AS genre
                    FROM Movie m
                    LEFT JOIN MovieGenre mg ON m.id = mg.movie_id
                    LEFT JOIN Genre g ON mg.genre_id = g.id
                    LIMIT ? OFFSET ?
                  `

    const [rows] = await db.execute(query, [limit, offset])

    // If movies can have multiple genres, group them
    const movieMap = {}
    rows.forEach(row => {
      if (!movieMap[row.id]) {
        movieMap[row.id] = { ...row, genre: [] }
      }
      if (row.genre) {
        movieMap[row.id].genre.push(row.genre)
      }
    })

    return Object.values(movieMap)
  }

  /**
   * Fetches the amount of movies in the database.
   *
   * @returns {number} - The amount of movies in the database.
   */
  async getTotalMovieCount () {
    const query = 'SELECT COUNT(*) as count FROM Movie'

    const [total] = await db.execute(query)

    return total[0].count
  }

  /**
   * Gets all actors.
   *
   * @param {number} limit - The amount of movies to fetch.
   * @param {number} offset - The offset (page)
   * @returns {Array} the movie objects.
   */
  async getActors (limit = 2000, offset = 1) {
    // Create query and fetch.
    const query = `SELECT * FROM Actor LIMIT ${limit} OFFSET ${offset}`

    const [actors] = await db.execute(query)

    return actors
  }

  /**
   * Fetches the amount of actors in the database.
   *
   * @returns {number} - The amount of actors in the database.
   */
  async getTotalActorCount () {
    const query = 'SELECT COUNT(*) as count FROM Actor'

    const [total] = await db.execute(query)

    return total[0].count
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

    const response = await db.execute(query, [id])

    const movie = response[0][0]

    // Get the genres.
    movie.genre = await this.getGenre(id)

    return movie
  }

  /**
   * Add a movie to the database.
   *
   * @param {string} title - Movie title.
   * @param {string} releaseYear - Year when movie was released.
   * @param {string} genre - Movie Genre.
   * @returns {string} the movie id.
   */
  async addMovie (title, releaseYear, genre) {
    if (releaseYear < 1800) {
      throw new Error('The release year has to be after the 1800')
    }

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

    return movieID
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

    if (releaseYear && releaseYear < 1800) {
      throw new Error('The release year has to be after the 1800')
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
   * Fetches the movies genres.
   *
   * @param {string} movieID - the movie id.
   * @returns {[string]} - All the genres of the movie in an array.
   */
  async getGenre (movieID) {
    const genreQuery = `SELECT 
                          g.name AS genre_name
                        FROM movie m
                        JOIN movie_has_genre mg ON m.id = mg.movie_id
                        JOIN genre g ON mg.genre_id = g.id
                        WHERE m.id = ${movieID}
                        `
    const [genres] = await db.execute(genreQuery)

    return genres.map(g => g.genre_name)
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
    const query = 'SELECT * FROM Rating WHERE movie_id = ?'
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

  /**
   * Fetches all the genres in the database.
   *
   * @returns {[string]} - all genres.
   */
  async getAllGenres () {
    // Query the db.
    const query = 'SELECT name FROM genre;'

    const [genres] = await db.execute(query)

    return genres.map(g => g.name)
  }
}
