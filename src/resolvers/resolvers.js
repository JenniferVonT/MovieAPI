/**
 * @file Defines the main resolver for the API
 * @module src/resolver/resolvers
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 * @version 1.0.0
 */

import { db } from '../config/dbsettings.js'

// TO-DO: Change to correct resolvers, this is just to test the db connection.
export const resolvers = {
    Query: {
      hello: async () => {
        try {
          // Try a simple query
          const response = await db.query('SELECT Profile_path FROM Actor WHERE name = "Tom Hanks"');
          const profile = response[0]
          const path = profile[0].Profile_path
          
          return `Tom Hanks profile path!: ${path}`;
        } catch (err) {
          // If there's an error, return it
          return `Database connection failed: ${err.message}`;
        }
      }
    }
  }