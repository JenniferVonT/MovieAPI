/**
 * @file Defines the movie resolver for the API
 * @module src/resolvers/movie
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 * @version 1.0.0
 */

// TO-DO: IMPLEMENT CORRECT MOVIE RESOLVER.

export const movieResolvers = {
  Query: {
    /**
     * Fetch some movies.
     *
     * @returns {Array} - an array of all the movies.
     */
    movies: async () => {
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
      return [
        { id: 5, name: 'Tom Hanks', Gender: 'Male', profile_path: './path/to/image' },
        { id: 6, name: 'Jennifer Lawrence', Gender: 'Female', profile_path: './path/to/image' }
      ]
    }
  }
}
