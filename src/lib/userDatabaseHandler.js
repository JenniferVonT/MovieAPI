/**
 * @file  Provides functions to the user portion of the database.
 * @module lib/userDatabaseHandler
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 * @version 1.0.0
 */

import { db } from '../config/dbsettings.js'

/**
 * A database handler class.
 */
export class UserDatabaseHandler {
  /**
   * Gets a user from the database by their username.
   *
   * @param {string} username - username.
   * @returns {object} the user object.
   */
  async getUser (username) {
    // Fetch the user from the database.
    const query = 'SELECT * FROM User WHERE username = ?'
    const response = await db.execute(query, [username])

    const user = response[0][0]

    // If the user doesn't exist throw an error.
    if (!user) {
      throw new Error('Username and/or password is incorrect')
    }

    return user
  }

  /**
   * Create a user in the database.
   *
   * @param {string} username - new username.
   * @param {string} password  - new password.
   */
  async createUser (username, password) {
    try {
      // Create the user in the database, if the user exist already throw an error.
      const query = 'INSERT INTO User (username, password) VALUES (?, ?)'

      await db.execute(query, [username, password])
    } catch (error) {
      error.message = 'That username already exists, try again.'
      error.status = 409
      throw error
    }
  }

  /**
   * Delete a user based on their ID.
   *
   * @param {string} userID - user ID
   */
  async deleteUser (userID) {
    try {
      // Create the delete query.
      const query = 'DELETE FROM User WHERE id = ?'

      await db.execute(query, [userID])
    } catch (error) {
      error.message = 'Could not delete that user'
      error.status = 409
      throw error
    }
  }
}
