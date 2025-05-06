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
 * Connects to the DB.
 *
 * @param {mysql.Pool} db - The pool created for the db.
 */
export const connectToDatabase = async (db) => {
  try {
    const connection = await db.getConnection()

    console.log('Database successfully connected!')

    connection.release()
  } catch (e) {
    process.exit(1)
  }
}
