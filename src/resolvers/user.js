/**
 * @file Defines the user resolver for the API
 * @module src/resolvers/user
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 * @version 1.0.0
 */

// import { db } from '../config/dbsettings.js'

// TO-DO: IMPLEMENT CORRECT USER RESOLVER.

export const userResolvers = {
  Query: {
    /**
     * Testing a query.
     *
     * @returns {string} - query response
     */
    users: async () => {
      // try {
      return [{ id: 1, name: 'Alice', email: 'alice@test.se' }]
      // } catch (err) {
      // If there's an error, return it
      // return `Database connection failed: ${err.message}`
      // }
    }
  }
}
