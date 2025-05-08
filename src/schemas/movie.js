/**
 * @file Defines the movie schemas for the API.
 * @module src/schemas/user
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 * @version 1.0.0
 */

import { gql } from 'graphql-tag'

export const movieTypeDefs = gql`
  type Movie {
    id: ID!
    Title: String!
    Release_year: Int
    Description: String
    poster_path: String
  }
  
  type Actor {
    id: ID!
    Name: String!
    Gender: Int
    Profile_path: String
  }

  type Query {
    movies: [Movie]
    actors: [Actor]
  }

  type Mutation {
    movie(id: ID!): Movie
    addMovie(title: String!, releaseYear: Int!, genre: String!): String!
    updateMovie(id: ID!, title: String, description: String, releaseYear: Int, genre: String): String!
    deleteMovie(id: ID!): String!
    ratings(movie_id: ID!): String!
  }
`
