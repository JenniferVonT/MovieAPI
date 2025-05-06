/**
 * @file Defines the schemas for the API.
 * @module src/model/schema
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 * @version 1.0.0
 */

import { gql } from 'graphql-tag'

// TO-DO: Update the correct queries!
export const typeDefs = gql`
  type Query {
    hello: String
  }
`
