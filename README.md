# MovieAPI

# Implementation type
- GraphQL 

# Links 
- [Production url](https://cscloud6-72.lnu.se/movieAPI/graphql)
- [Postman document url](https://.postman.co/workspace/Public-workspace~986be849-2061-4d76-abaf-b21a06e70d95/collection/34049622-9ebe5071-cae4-4fb3-ba74-0feb479768d1?action=share&creator=34049622&active-environment=34049622-e47db617-bb47-4326-89b6-f83ab5e6175f)
- [GraphQL Sandbox/playground](https://studio.apollographql.com/graph/movieAPI/variant/current/home)

## Description
This API allows you to manage a vast movie database.
You can fetch data about thousands of international movies and actors, and by creating a user you can add, edit and remove movies of your choice.

To see the poster_path and profile_path images you need the image base url.
- `https://image.tmdb.org/t/p/original` 

## Technologies Used
- JavaScript
- GraphQL
- Node.js
- express (backend framework)
- docker (container for database)
- mysql 8:0 (DBMS)
- MySQL workbench (DBMS for local testing)
- SQL (database language)
- Postman (testing)
- GraphQL sandbox (testing)
- Git (version control)
- nginx + ubuntu (Host server)
- Jason Web Token (JWT) (authentication)

## Installation Instructions
   - **Steps:**
     - **Clone the Repository:** In the repository click the "Fork" button in the top right corner, set your own name and description and click "Create Fork". Clone the repo to your local machine by clicking the "Code" button in the forked repository and copy the SSH or HTTPS adress. Open a bash terminal where you want to put it on your machine and enter 

        SSH: `git add git@github.com:<your_GH_username>/<your-repo-name>.git`

        HTTPS: `git add https://github.com/<your_GH_username>/<your-repo-name>.git`

          ** Don't forget that you need an SSH key on your computer to successfully clone the project onto your computer. [HERE IS HOW](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

     - **Navigate to the Project Directory:** Change directory to the cloned repository on your computer.
     - **Install Dependencies:** Install necessary packages using `npm install`.
     - **Configure Environment Variables:** Set up the `.env` file with required environment variables. see [EXAMPLE](./example.env)

   - **Setting up database**
     - **Set up:** first set up your mysql 8:0 database, [HERE](https://dilsichandrasena.medium.com/how-to-deploy-and-use-a-mysql-docker-container-in-ubuntu-4ace7c893982) is a good guide to set up a mysql server on a docker container **(note that you need to user version 8:0 and not 5:7 as in the guide for the seeds to work).
     - **populate the server:** import the db_seed_scripts as you please into the server or container (either directly or by bind mounting it) and first run these scripts in this order (important!):
       - createdb.sql (creates the database schema)
       - import_all.sql (populates the database with data)

   - **Testing with Postman:**
     - **Import the Collection:** Click the Collections tab in the left column and then the `import` button in the top left corner by your workspace, insert the [collection seed](./testing/MovieAPI.postman_collection.json) and it will automatically build a new collection.
     - **Set Up Environment Variables:** Update the [enviroment file](./testing/example.postman_environment.json) with your base url (the rest is handled dynamically). Click the Environments tab in the left column in postman and then the `import` button in the top left corner by your workspace. Go back to your first collection that you imported and in the top right corner it says "No environment" click it and select your newly imported environment (Example environment if you haven't changed the name).
     - **Run the Tests:** In postman select your newly imported collection `MovieAPI` and in the top right corner click the `run`button.