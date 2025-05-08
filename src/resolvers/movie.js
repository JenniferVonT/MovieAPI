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
      // TO-DO: Implement method.
      const movie = { id: 101, title: 'The Matrix', releaseYear: 1999 }
      return movie
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
      // TO-DO: Implement method.
      return 'Movie added!'
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
      // TO-DO: Implement method.
      return 'Movie changed!'
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
      // TO-DO: Implement method.
      return 'Movie deleted!'
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
