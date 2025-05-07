/**
 * @file Combines all the schemas for the API.
 * @module src/schemas/schema
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 * @version 1.0.0
 */

import { mergeTypeDefs } from '@graphql-tools/merge'
import { baseTypeDefs } from './base.js'
import { userTypeDefs } from './user.js'
import { movieTypeDefs } from './movie.js'

export const typeDefs = mergeTypeDefs([
  baseTypeDefs,
  userTypeDefs,
  movieTypeDefs
])
