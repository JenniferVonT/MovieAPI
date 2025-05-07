/**
 * @file Defines the movie resolver for the API
 * @module src/resolvers/movie
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 * @version 1.0.0
 */

export const movieResolvers = {
  Query: {
    /**
     * Fetch some movies.
     *
     * @returns {Array} - an array of all the movies.
     */
    movies: async () => {
      // TO-DO: Implement method.
      return [
        { id: 101, title: 'The Matrix', releaseYear: 1999 },
        { id: 102, title: 'Inception', releaseYear: 2010 }
      ]
    },

    /**
     * Fetch all the movies.
     *
     * @returns {Array} - an array of all the actors.
     */
    actors: async () => {
      // TO-DO: Implement method.
      return [
        { id: 5, name: 'Tom Hanks', Gender: 'Male', profile_path: './path/to/image' },
        { id: 6, name: 'Jennifer Lawrence', Gender: 'Female', profile_path: './path/to/image' }
      ]
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
     * Update a movie in the database
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
     * Delete a movie in the database
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
     * Fetch a movies ratings in the database
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
