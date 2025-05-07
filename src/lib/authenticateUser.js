/**
 * @file  Verifies the user with the JWT token.
 * @module lib/verifyUser
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 * @version 1.0.0
 */

import { DatabaseHandler } from './databaseHandler.js'
import { JsonWebToken } from './JsonWebToken.js'

const DBHandler = new DatabaseHandler()

/**
 * Verify the user against the JWT.
 *
 * @param {object} accessToken - JWT access token.
 * @returns {object} - If user is authenticated return the user object.
 */
export const authenticateUser = async (accessToken) => {
  let error

  // If access token is missing throw an error.
  if (!accessToken) {
    error = new Error('JWT access token needed for this operation. Login to get it.')
    error.status = 401
    throw error
  }

  // Decode the JWT and check against the database.
  const JWT = await JsonWebToken.decodeUser(accessToken, process.env.JWT_KEY)

  // Get the user.
  const user = await DBHandler.getUser(JWT.username)

  // Check that the ID is correct.
  if (JWT.id !== user.ID) {
    error = new Error('Invalid access token')
    error.status = 403
    throw error
  }

  return user
}
