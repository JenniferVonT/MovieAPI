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
  
  type Actor {
    id: ID!
    name: String!
    gender: String!
    profile_path: String!
  }

  type Query {
    movies: [Movie]
    actors: [Actor]
  }

  type Mutation {
    movie(id: ID!): Movie
    addMovie(title: String!, release_year: Int!, genre: String!): String!
    updateMovie(id: ID!, title: String!, release_year: Int!, genre: String!): String!
    deleteMovie(id: ID!, title: String!, release_year: Int!, genre: String!): String!
    ratings(movie_id: ID!): String!
  }
`
