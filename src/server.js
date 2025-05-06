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
import { typeDefs } from './models/schema.js'
import { resolvers } from './resolvers/resolvers.js'
import { randomUUID } from 'node:crypto'
import http from 'node:http'
import { logger } from './config/winston.js'
import { connectToDatabase, db } from './config/dbsettings.js'

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
    resolvers
  })

  await graphqlServer.start()

  // Mount GraphQL endpoint middleware.
  app.use('/graphql', expressMiddleware(graphqlServer))

  // Health check endpoint (optional, useful in production).
  app.get('/health', (req, res) => res.status(200).send('OK'))

  // Error handler.
  app.use((err, req, res, next) => {
    logger.error(err.message, { error: err })

    if (process.env.NODE_ENV === 'production') {
      // Ensure a valid status code is set for the error.
      // If the status code is not provided, default to 500 (Internal Server Error).
      // This prevents leakage of sensitive error details to the client.
      if (!err.status) {
        err.status = 500
        err.message = http.STATUS_CODES[err.status]
      }

      // Send only the error message and status code to prevent leakage of
      // sensitive information.
      res
        .status(err.status)
        .json({
          status_code: err.status,
          message: err.message
        })

      return
    }

    // ---------------------------------------------------
    // ⚠️ WARNING: Development Environment Only!
    //             Detailed error information is provided.
    // ---------------------------------------------------

    // Deep copies the error object and returns a new object with
    // enumerable and non-enumerable properties (cyclical structures are handled).
    const copy = JSON.stringify(err, Object.getOwnPropertyNames(err))

    return res
      .status(err.status || 500)
      .json(copy)
  })

  // Starts the HTTP server listening for connections.
  const server = app.listen(process.env.PORT, () => {
    logger.info(`Server running at http://localhost:${server.address().port}`)
    logger.info('Press Ctrl-C to terminate...')
  })
} catch (err) {
  logger.error(err.message, { error: err })
  process.exitCode = 1
}
