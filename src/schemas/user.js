/**
 * @file Defines the user schemas for the API.
 * @module src/schemas/user
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 * @version 1.0.0
 */

import { gql } from 'graphql-tag'

// TO-DO: Update the correct queries!
export const userTypeDefs = gql`
  type User {
    username: String!
    password: String!
  }

  type Query {
    userOperations: String!
  }

  type Mutation {
    newUser(username: String!, password: String!): String!
    login(username: String!, password: String!): String!
  }
`
