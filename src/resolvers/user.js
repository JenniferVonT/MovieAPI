/**
 * @file Defines the user resolver for the API
 * @module src/resolvers/user
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 * @version 1.0.0
 */

import { db } from '../config/dbsettings.js'
import { JsonWebToken } from '../lib/JsonWebToken.js'

// TO-DO: IMPLEMENT CORRECT USER RESOLVER.

export const userResolvers = {
  Query: {
    /**
     * Get information about the operations available to the user schema.
     *
     * @returns {string} - information.
     */
    userOperations: () => {
      return `Available operations for user is: 
              - newUser(username: String!, password: String!)
                  Create a new user to be able to modify movies,
              - login(username: String!, password: String!): JWT!
                  Login to a user to get a JWT key for authentication.
              `
    }
  },

  Mutation: {
    /**
     * Create a new user for authentication.
     *
     * @param {string} username - new username.
     * @param {string} password - new password.
     * @returns {string} - Confirmation message.
     */
    newUser: (username, password) => {
      console.log(username, password)
      return 'A user was successfully created, login to get an authentication key!'
    },

    /**
     * Login to get a JWT token for authentication.
     *
     * @param {string} username - user
     * @param {string} password - psw
     * @returns {string} - JWT.
     */
    login: (username, password) => {
      console.log(username, password)
      return 'JWT key' // UPDATE RETURN
    }
  }
}
