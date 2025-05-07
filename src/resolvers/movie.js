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
     * @returns {Array} - an array of movies.
     */
    movies: async () => {
      // try {
      // Replace with DB logic
      return [
        { id: 101, title: 'The Matrix', releaseYear: 1999 },
        { id: 102, title: 'Inception', releaseYear: 2010 }
      ]
      /* } catch (err) {
        // throw new Error(`Failed to fetch movies: ${err.message}`)
      } */
    }
  }
}
