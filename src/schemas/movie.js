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
    title: String!
    genres: [String]
    release_year: Int
    description: String
    poster_path: String
  }

  type MovieWithRatings {
    id: ID!
    title: String!
    genres: [String]
    release_year: Int
    description: String
    poster_path: String
    ratings: Rating
  }

  type PaginatedMovies {
    movies: [Movie]
    total: Int
  }
  
  type Actor {
    id: ID!
    name: String!
    gender: Int
    profile_path: String
  }

  type PaginatedActors {
    actors: [ActorWithRoles]
    total: Int
  }

  type ActorWithRoles {
    id: ID!
    name: String!
    gender: Int
    profile_path: String
    roles: [Role]
  }

  type Role {
    character: String
    movie_title: String
    movie_id: ID
  }

  type Rating {
    average: Float!,
    allRatings: [Float!]!
  }


  type Query {
    genres: [String!]
  }

  type Mutation {
    actors(page: Int, limit: Int): PaginatedActors
    actor(name: String!): ActorWithRoles
    movies(page: Int, limit: Int): PaginatedMovies
    movie(id: ID!): MovieWithRatings
    addMovie(title: String!, releaseYear: Int!, genre: String!): Movie!
    updateMovie(id: ID!, title: String, description: String, releaseYear: Int, genre: String): String!
    deleteMovie(id: ID!): String!
    ratings(movieId: ID!): Rating!
  }
`
