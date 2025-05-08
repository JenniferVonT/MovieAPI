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

  type MovieWithRatings {
    id: ID!
    Title: String!
    Release_year: Int
    Description: String
    poster_path: String
    ratings: Rating
  }
  
  type Actor {
    id: ID!
    Name: String!
    Gender: Int
    Profile_path: String
  }

  type ActorWithRoles {
    id: ID!
    Name: String!
    Gender: Int
    Profile_path: String
    Roles: [Role]
  }

  type Role {
    character: String
    movie: String
  }

  type Rating {
    average: Float!,
    allRatings: [Float!]!
  }

  type Query {
    movies: [Movie]
    actors: [Actor]
  }

  type Mutation {
    actor(name: String!): ActorWithRoles
    movie(id: ID!): MovieWithRatings
    addMovie(title: String!, releaseYear: Int!, genre: String!): String!
    updateMovie(id: ID!, title: String, description: String, releaseYear: Int, genre: String): String!
    deleteMovie(id: ID!): String!
    ratings(movieId: ID!): Rating!
  }
`
