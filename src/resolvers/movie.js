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
     * Fetch a specific actor (optional with their roles).
     *
     * @param {object} parent - Parent/root object.
     * @param {object} payload - arguments.
     * @param {object} context - The context object
     * @param {object} info - The info object.
     * @returns {object} - Movie object.
     */
    actor: async (parent, payload, context, info) => {
      const { name } = payload

      // Fetch the actor from the database.
      const [actor] = await DBHandler.getActorByName(name)

      // Check if roles are also requested (nested query)
      const fieldNodes = info.fieldNodes
      const rolesReq = fieldNodes.some(node => node.selectionSet && node.selectionSet.selections.some(sel => sel.name.value === 'roles'))

      if (rolesReq) {
        const roles = await DBHandler.getAllRoles(actor.id)

        actor.roles = []

        // Insert all the roles and their movies in the actor object.
        for (const role of roles) {
          const [movie] = await DBHandler.getMovieByID(role.movie_id)

          actor.roles.push({
            character: role.character_name,
            movie: movie.title
          })
        }
      }

      return actor
    },

    /**
     * Fetch all the movies in the database.
     *
     * @param {object} parent - Parent/root object.
     * @param {object} args - The arguments passed to the query.
     * @param {number} args.page - The page number to fetch.
     * @param {number} args.limit - The number of items per page.
     * @returns {Array} - an array of all the movies.
     */
    movies: async (parent, { page = 1, limit = 20 }) => {
      try {
        // Validate the input parameters
        if (page < 1 || limit < 1) {
          throw new Error('Page and limit must be greater than 0.')
        } else if (limit > 500) {
          throw new Error('max limit is 500')
        }

        const offset = (page - 1) * limit

        // Fetch all movies.
        const movieObj = await DBHandler.getMovies(limit, offset)

        // and the amount of movies.
        const total = await DBHandler.getTotalMovieCount()

        return {
          movies: movieObj,
          total
        }
      } catch (error) {
        console.error(error)
        throw error
      }
    },

    /**
     * Fetch a specific movie (optional nested with ratings.).
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
