/* eslint-disable jsdoc/no-undefined-types */
/**
 * @file Defines the main application.
 * @module src/server
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 * @version 1.0.0
 */

import httpContext from 'express-http-context' // Must be first!
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { typeDefs } from './schemas/schema.js'
import { resolvers } from './resolvers/resolver.js'
import { randomUUID } from 'node:crypto'
import { logger } from './config/winston.js'
import { connectToDatabase, db } from './config/dbsettings.js'
import { GraphQLError } from 'graphql'

try {
  // Connect to database
  await connectToDatabase(db)

  // Create an Express application.
  const app = express()

  // Set various HTTP headers to make the application little more secure (https://www.npmjs.com/package/helmet).
  app.use(helmet())

  // Enable Cross Origin Resource Sharing (CORS) (https://www.npmjs.com/package/cors).
  app.use(cors())

  // Parse requests of the content type application/json.
  app.use(express.json())

  // Add the request-scoped context.
  // NOTE! Must be placed before any middle that needs access to the context!
  //       See https://www.npmjs.com/package/express-http-context.
  app.use(httpContext.middleware)

  // Middleware.
  app.use((req, res, next) => {
    // Add a request UUID to each request and store information about
    // each request in the request-scoped context.
    req.requestUuid = randomUUID()
    httpContext.set('request', req)

    next()
  })

  // Initialize Apollo Server.
  const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    status400ForVariableCoercionErrors: true,
    /**
     * Set up a custom error handler, only show pertinent information in production.
     *
     * @param {GraphQLFormattedError} formattedError - Default formatted error object.
     * @param {GraphQLError} error - Raw error object.
     * @returns {object} - A custom error object.
     */
    formatError: (formattedError, error) => {
      if (process.env.NODE_ENV === 'production') {
        return new GraphQLError(error.message, {
          extensions: {
            code: error.extensions?.code || 'ERROR',
            status: error.originalError.status
          }
        })
      }

      return error
    }
  })

  await graphqlServer.start()

  // Mount GraphQL endpoint middleware and set the context.
  app.use('/graphql', expressMiddleware(graphqlServer, {
    /**
     * Extract the JWT token from the header and insert in the context.
     *
     * @param {object} param0 - An object containing the incoming request.
     * @param {import('express').Request} param0.req - The Express request object, used to access headers.
     * @returns {object} - The JWT token within the context.
     */
    context: async ({ req }) => {
      // Extract the Authorization header.
      const authHeader = req.headers.authorization || ''

      // If the Authorization header exists and contains the Bearer token, extract the token.
      const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null

      // Return the token in the context object (or null if not found)
      return { token }
    }
  }))

  // Health check endpoint (optional, useful in production).
  app.get('/health', (req, res) => res.status(200).send('OK'))

  // Starts the HTTP server listening for connections.
  const server = app.listen(process.env.PORT, () => {
    logger.info(`Server running at http://localhost:${server.address().port}`)
    logger.info('Press Ctrl-C to terminate...')
  })
} catch (err) {
  logger.error(err.message, { error: err })
  process.exitCode = 1
}
