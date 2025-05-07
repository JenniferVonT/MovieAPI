/**
 * @file Combines the resolvers for the API
 * @module src/resolvers/resolver
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 * @version 1.0.0
 */

import merge from 'lodash.merge'
import { userResolvers } from './user.js'
import { movieResolvers } from './movie.js'

export const resolvers = merge({}, userResolvers, movieResolvers)
