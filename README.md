# The Learning Club

The Learning Club provides learning resources each month around a specific topic. It then allows users to join group and attend events to discuss what they've learned a meet new people.

This repo contains the server application. The client application can be accessed [here](https://github.com/mirandajoy/miranda-neerhof-the-learning-club).

## Dependencies

This applications is built using a MySQL database. You'll need to have it installed to seed data and run the server. If you don't have MySQL installed you can follow the directions [here for Mac](https://dev.mysql.com/doc/refman/8.0/en/macos-installation.html) and [here for Windows](https://dev.mysql.com/doc/refman/8.0/en/windows-installation.html).

## Installation

1. Clone the repo
   ```sh
   git clone git@github.com:mirandajoy/the-learning-club-api.git
   ```

2. Install NPM packages
   ```sh
   npm install
   ```

3. Create a .env file in the root of the project
   ```sh
   touch .env
   ```

4. Add the following variables to your .env file in the root of the project
   ```js
   PORT=Add port where you want to run your server
   CROSS_ORIGIN=Add the url where the client application will run
   PW=Add your MySQL password
   DB=learning_club
   ```

5. Start your MySQL server on the command line and create a new database
    ```sh
   mysql> CREATE DATABASE learning_club;
   ```

6. Migrate tables
    ```sh
   npm run migrate
   ```

7. Seed data
    ```sh
   npm run seed
   ```

8. Enter the follow command in the terminal to generate a key to sign the JWT tokens and add it to your .env file
    ```sh
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
    ```
    ```js
    JWT_KEY=Add generated key
    ```

9. Run the application locally
    ```sh
   npm run dev
   ```