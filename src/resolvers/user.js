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
     * @param {object} parent - parent object.
     * @param {string} payload - username and password.
     * @returns {string} - Confirmation message.
     */
    newUser: async (parent, payload) => {
      try {
        const { username, password } = payload
        let error

        // Check if the username and password is a vaild length.
        if (username.length < 4) {
          error = new Error('Username not long enough, it needs to be atleast 4 characters long')
          error.status = 422
        }

        if (password.length < 10) {
          if (error) {
            error.message = 'Username and password not long enough. Username needs to be atleast 4 characters long and password 10 characters long'
          } else {
            error = new Error('Password not long enough, it needs to be atleast 10 characters long')
            error.status = 422
          }
        }

        if (error) {
          throw error
        }

        // Hash the password.
        const hashedPassword = await argon2.hash(password)

        // Create the user in the database, if the user exist already throw an error.
        const query = 'INSERT INTO User (username, password) VALUES (?, ?)'
        const response = await db.execute(query, [username, hashedPassword])

        if (!response) {
          error = new Error('That username already exists, try again.')
          error.status = 409
          throw error
        }

        return 'A user was successfully created, login to get an authentication key!'
      } catch (error) {
        console.error(error)
        throw error
      }
    },

    /**
     * Login to get a JWT token for authentication.
     *
     * @param {object} parent - Parent/root object.
     * @param {object} payload - username and password.
     * @returns {string} - JWT token.
     */
    login: async (parent, payload) => {
      try {
        const { username, password } = payload
        let error

        // Check that username and password is given.
        if (!username) {
          error = new Error('Username is missing')
        } else if (!password) {
          error = new Error('Password is missing')
        } else if (!username && !password) {
          error = new Error('Username and password is missing')
        }

        if (error) {
          throw error
        }

        // Fetch the user from the database.
        const query = 'SELECT * FROM User WHERE username = ?'
        const response = await db.execute(query, [username])

        const user = response[0][0]

        // If the user doesn't exist throw an error.
        if (!user) {
          error = new Error('User does not exist')
          throw error
        }

        // Compare the passwords against eachoter.
        const comparedPasswords = await argon2.verify(user.password, password)

        if (!comparedPasswords) {
          error = new Error('Username or password is incorrect')
          throw error
        }

        const JWTuser = { id: user.ID, username }

        // Create access JWT token and return it.
        const accessToken = await JsonWebToken.encodeUser(JWTuser,
          process.env.JWT_KEY,
          process.env.JWT_TTL
        )

        return accessToken
      } catch (error) {
        console.error(error)
        throw error
      }
    },

    /**
     * Delete an existing user.
     *
     * @param {object} parent - Parent/root object.
     * @param {object} args - Argument object.
     * @param {object} context - Context object.
     * @returns {string} - Confirmation message.
     */
    deleteUser: (parent, args, context) => {
      console.log(context)
      return 'User deleted'
    }
  }
}
