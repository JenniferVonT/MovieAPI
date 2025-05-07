/**
 * @file  Provides helper methods for working with JSON Web Tokens (JWTs).
 * @module lib/JsonWebTokens
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken'

/**
 * Class with methods for working with JSON Web Tokens (JWTs).
 */
export class JsonWebToken {
  /**
   * Encodes user information into a JSON Web Token (JWT) payload.
   *
   * @param {object} user - The user object containing user information to encode.
   * @param {string} key - The key key used for signing the JWT.
   * @param {string|number} expiresIn - The expiration time for the JWT, specified in seconds or as a string describing a time span (e.g., '1d', '2h') using the vercel/ms library.
   * @returns {Promise<string>} A Promise that resolves to the generated JWT.
   */
  static async encodeUser (user, key, expiresIn) {
    const payload = {
      id: user.id,
      username: user.username
    }

    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        key,
        {
          algorithm: 'RS256',
          expiresIn
        },
        (error, token) => {
          if (error) {
            reject(error)
            return
          }

          resolve(token)
        }
      )
    })
  }

  /**
   * Decodes a JWT and returns the user object extracted from the payload.
   *
   * @param {string} token - The JWT to decode.
   * @param {string} key - The key key used for verifying the JWT.
   * @returns {Promise<object>} A Promise that resolves to the user object extracted from the JWT payload.
   */
  static async decodeUser (token, key) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, key, (error, decoded) => {
        if (error) {
          reject(error)
          return
        }

        const user = {
          id: decoded.id,
          username: decoded.username
        }

        resolve(user)
      })
    })
  }
}
