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
     * @returns {object} - Movie object.
     */
    movie: async (parent, payload) => {
      try {
        // Fetch movie based on id.
        const movie = await DBHandler.getMovieByID(payload.id)

        if (!movie) {
          throw new Error('Movie does not exist!')
        }

        return movie[0]
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
      // TO-DO: Implement method.
      return 'Star Wars rating: 4.5/5 (2.4K)'
    }
  }
}
