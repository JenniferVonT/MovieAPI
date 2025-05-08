/**
 * @file Defines the movie resolver for the API
 * @module src/resolvers/movie
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 * @version 1.0.0
 */

import { authenticateUser } from '../lib/authenticateUser.js'
import { MovieDatabaseHandler } from '../lib/movieDatabaseHandler.js'

const DBHandler = new MovieDatabaseHandler()

export const movieResolvers = {
  Query: {
    /**
     * Fetch all the movies in the database.
     *
     * @returns {Array} - an array of all the movies.
     */
    movies: async () => {
      try {
        // Fetch all movies.
        const movieObj = await DBHandler.getAllMovies()

        return movieObj[0]
      } catch (error) {
        console.error(error)
        throw error
      }
    },

    /**
     * Fetch all the movies.
     *
     * @returns {Array} - an array of all the actors.
     */
    actors: async () => {
      try {
        // Fetch all Actors.
        const actorObj = await DBHandler.getAllActors()

        return actorObj[0]
      } catch (error) {
        console.error(error)
        throw error
      }
    }
  },

  Mutation: {
    /**
     * Fetch a specific movie.
     *
     * @param {object} parent - Parent/root object.
     * @param {object} payload - arguments.
     * @param {object} context - The context object
     * @param {object} info - The info object.
     * @returns {object} - Movie object.
     */
    movie: async (parent, payload, context, info) => {
      try {
        const id = payload.id

        // Fetch movie based on id.
        const [movie] = await DBHandler.getMovieByID(id)

        if (!movie || movie.length === 0) {
          throw new Error('Movie does not exist!')
        }

        // Check if ratings are also requested (nested query)
        const fieldNodes = info.fieldNodes
        const ratingReq = fieldNodes.some(node => node.selectionSet && node.selectionSet.selections.some(sel => sel.name.value === 'ratings'))

        // If it is include it in the response.
        if (ratingReq) {
          const ratings = await DBHandler.getAllRatings(id)
          movie.ratings = ratings
        }

        return movie
      } catch (error) {
        console.error(error)
        throw error
      }
    },

    /**
     * Add a movie to the database.
     *
     * @param {object} parent - Parent/root object.
     * @param {object} payload - arguments.
     * @param {object} context - The context containing accesstoken.
     * @returns {string} - confirmation message.
     */
    addMovie: async (parent, payload, context) => {
      try {
        // Authenticate the user.
        const accessToken = context.token

        await authenticateUser(accessToken)

        const { title, releaseYear, genre } = payload

        await DBHandler.addMovie(title, releaseYear, genre)

        return 'Movie successfully added'
      } catch (error) {
        console.error(error)
        throw error
      }
    },

    /**
     * Update a movie in the database.
     *
     * @param {object} parent - Parent/root object.
     * @param {object} payload - arguments.
     * @param {object} context - The context containing accesstoken.
     * @returns {string} - confirmation message.
     */
    updateMovie: async (parent, payload, context) => {
      try {
        // Authenticate the user.
        const accessToken = context.token

        await authenticateUser(accessToken)

        // Extract all the arguments
        const { id, title, description, releaseYear, genre } = payload

        // Query the database.
        await DBHandler.updateMovie(id, title, description, releaseYear, genre)

        // If no errors where thrown send a confirmation message.
        return 'Movie successfully changed!'
      } catch (error) {
        console.error(error)
        throw error
      }
    },

    /**
     * Delete a movie in the database.
     *
     * @param {object} parent - Parent/root object.
     * @param {object} payload - arguments.
     * @param {object} context - The context containing accesstoken.
     * @returns {string} - confirmation message.
     */
    deleteMovie: async (parent, payload, context) => {
      try {
        // Authenticate the user.
        const accessToken = context.token

        await authenticateUser(accessToken)

        // Extract the id.
        const { id } = payload

        // Query the database to remove the movie.
        await DBHandler.deleteMovie(id)

        return 'Movie successfully deleted!'
      } catch (error) {
        console.error(error)
        throw error
      }
    },

    /**
     * Fetch a movies ratings in the database.
     *
     * @param {object} parent - Parent/root object.
     * @param {object} payload - arguments.
     * @returns {string} - confirmation message.
     */
    ratings: async (parent, payload) => {
      try {
        // Extract the id.
        const { movieId } = payload

        // Get all the ratings for the movie.
        const ratings = await DBHandler.getAllRatings(movieId)

        // Return the finished Rating object.
        return ratings
      } catch (error) {
        console.error(error)
        throw error
      }
    }
  }
}
