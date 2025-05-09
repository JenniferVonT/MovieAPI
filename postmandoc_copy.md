# MovieAPI Documentation

The movieAPI provides many API operations that enable you to manage movies seamlessly through the graphQL language/interface. Create, update and delete movies of your choice, get data on thousands of actors and movies in seconds.

## **Getting started guide**

To start using the movieAPI, you need to -

- The operations requiring authentication need a JWT bearer token in the header, which you can read about how to get under the authentication section
    
- The API only responds to HTTPS-secured communications. Any requests sent via HTTP return an HTTP 301 redirect to the corresponding HTTPS resources.
    
- The API returns request responses in application/JSON format. When an API request returns an error, it is sent in the JSON response as an error key.
    
- The API only uses one endpoint for operations and can be reached at: [https://cscloud6-72.lnu.se/movieAPI/graphql](https://cscloud6-72.lnu.se/movieAPI/graphql)
    
- To check the status of the API, you can query /health, which returns a 200 status code if the server is up and running.
    

## Authentication

The movieAPI uses JWT bearer tokens for authentication.

To get a JWT token, you need to run the newUser and login operations with a username and password. If a user already exists, the login operation is enough, it will only return a JWT token, which is valid for 12 hours.

For all operations that create, edit, and delete a resource, you will need to supply the JWT bearer token in the header of your request. The read-only queries and mutations do not need any authentication.

### Authentication error response

If an API token is missing, malformed, or invalid, you will receive an HTTP 401 or 403 Unauthorized response code.

## Rate and usage limits

At the moment there is no rate or usage limits.

## Operations

`** = requires authentication with a JWT token.`

`! = required parameter`

Mutations/Queries:

#### User:

- newUser(username: String, password: String): Creates a new user.
    
- login(username: String, password: String): Returns a JWT access token.
    
- deleteUser(username): ** Deletes a user completely from the database.
    

---

#### Movies/Actors:

- actors(page: Int, limit: Int): Returns a array of actors, default page/limit is 1/20.
    
- actor(name: String!): Returns an object with information about an actor.
    
- movies(page: Int, limit: Int): Returns an object with a list of movies, default page/limit is 1/20.
    
- movie(id: ID!): Returns an object with information about a movie.
    
- ratings(movieId: ID!): Returns an object with the ratings (all and average).
    
- addMovie(title: String!, releaseYear: Int!, genre: String!): ** Creates a movie in the database.
    
- updateMovie(id: ID!, title: String, description: String, releaseYear: Int, genre: String): ** Updates an existing movie.
    
- deleteMovie(id: ID!): ** Deletes an existing movie.
    

Here is an example of the movie operation that fetches a movie with all available information.

``` graphql
mutation Movie {
    movie(id: "24") {
        id
        title
        release_year
        description
        poster_path
    }
}

 ```

#### Nested queries

There is some nested queries available

- actor nested with roles: get data on an actor and include all of their movie roles.
    
- movie nested with ratings: get data on a movie and include their rating.
    

Example of a nested actor/roles operation:

``` graphql
mutation Actor {
    actor(name: "tom hanks") {
        id
        name
        gender
        profile_path
        roles {
            character
            movie
        }
    }
}

 ```

### **Need some help?**

This API is available as a playground/sandbox at [https://studio.apollographql.com/graph/movieAPI/variant/current/home](https://studio.apollographql.com/graph/movieAPI/variant/current/home), when entering the site you will need an apollo account and click the "Run in Explorer" button in the top right corner. There you can try out all of the available operations.

To check out the API source code visit [https://gitlab.lnu.se/1dv027/student/jv222th/assignment-api-design](https://gitlab.lnu.se/1dv027/student/jv222th/assignment-api-design)

If you want to host your own API server there is database seed scripts in the source code repository that works on a mysql 8:0 server. They include both the built of the database tables and populates with data, just run the createdb.sql and then the import_all.sql inside your SQL database.