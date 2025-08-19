/* eslint-disable jsdoc/require-param-type */
/**
 * @file This module contains the database settings and connection.
 * @module dbsettings
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 */

import mysql from 'mysql2'

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}).promise()

/**
 * Connects to the DB with retry logic.
 *
 * @param {mysql.Pool} db - The pool created for the db.
 * @param retries How many times it tries to connect.
 * @param delay How long the delay between tries should be.
 */
export const connectToDatabase = async (db, retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await db.getConnection()
      console.log('✅ Database successfully connected!')
      connection.release()
      return
    } catch (e) {
      console.error(`⚠️ Database connection failed. Retry ${i + 1}/${retries}...`)
      console.error(e.message)
      if (i < retries - 1) {
        // eslint-disable-next-line promise/param-names
        await new Promise(res => setTimeout(res, delay))
      } else {
        console.error('❌ Could not connect to the database. Exiting.')
        process.exit(1)
      }
    }
  }
}
