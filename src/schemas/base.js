/**
 * @file Defines the base schemas for the API.
 * @module src/schemas/base
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 * @version 1.0.0
 */

import { gql } from 'graphql-tag'

export const baseTypeDefs = gql`
  type Query {
    _empty: String
  }
`
