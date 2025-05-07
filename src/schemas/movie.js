/**
 * @file Defines the movie schemas for the API.
 * @module src/schemas/user
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 * @version 1.0.0
 */

import { gql } from 'graphql-tag'

// TO-DO: Update the correct queries!
export const movieTypeDefs = gql`
  type Movie {
    id: ID!
    title: String!
    description: String!
    release_year: Int!
  }

  extend type Query {
    movies: [Movie]
  }
`
