/**
 * @file Defines the user resolver for the API
 * @module src/resolvers/user
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 * @version 1.0.0
 */

import { db } from '../config/dbsettings.js'
import { JsonWebToken } from '../lib/JsonWebToken.js'
import argon2 from 'argon2'

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
     * @param {Object} parent - parent object.
     * @param {string} payload - username and password.
     * @returns {string} - Confirmation message.
     */
    newUser: async (parent, payload) => {
      try {
        const { username, password } = payload

        // Check if the username and password is vaild.
        if (username.length < 4) {
          const error = new Error('Username not long enough, it needs to be atleast 4 characters long')
          error.status = 422
          throw error
        }

        if (password.length < 10) {
          const error = new Error('Password not long enough, it needs to be atleast 10 characters long')
          error.status = 422
          throw error
        }

        // Hash the password.
        const hashedPassword = await argon2.hash(password)

        /*
        const query = 'INSERT INTO User (username, password) VALUES (?, ?)'
        await db.execute(query, [username, hashedPassword])
        */

        return 'A user was successfully created, login to get an authentication key!'
      } catch (error) {
        console.error(error)
        throw error
      }
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
