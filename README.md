# Backend API for accessing application data programmatically

## Link to hosted version of this project 
https://newsservicerg.onrender.com/

## Project description
This project is a hosted RESTful API that allows us, through using various endpoints, to interact with a database using CRUD operations.
The database holds information about news articles and has several related tables that interact to serve the data required.



## Cloning
Please copy the URL https://github.com/GowerRob/news-backend-portfolio

To clone in terminal:     $ git clone https://github.com/GowerRob/news-backend-portfolio


## Dependencies/Packages
The project will require several dependant packages to run.  
These can be installed using npm, or package manager of your choice.
Please find details of each below on npm:

### Dependencies

dotenv : https://www.npmjs.com/package/dotenv
    Description/Use: loads enviromental variables from a .env file into process.env


express : https://www.npmjs.com/package/express
    Description/Use: Minimalist web framework, for setting up your HTTP servers/apps

pg : https://www.npmjs.com/package/pg
    Description/Use: Non-blocking PostgreSQL client for Node.js.

### Developer Dependencies

husky : https://www.npmjs.com/package/husky
    Description/Use: Husky improves your commits. You can use it to lint your commit messages, run tests, lint code, etc... when you commit or push

jest : https://www.npmjs.com/package/jest
    Description/Use: JavaScript Testing Framework with a focus on simplicity

jest-extended : https://www.npmjs.com/package/jest-extended
    Description/Use:jest-extended aims to add additional matchers to Jest's default ones making it easy to test everything

pg-format : https://www.npmjs.com/package/pg-format?activeTab=readme
    Description/Use: Node.js implementation of PostgreSQL format() to safely create dynamic SQL queries.

supertest : https://www.npmjs.com/package/supertest
    Description/Use: high-level abstraction for testing HTTP



## Initialising Seeding
Please initalise and seed the database using the following scripts

For Development and testing:
/$ npm run setup-dbs
/$ npm run seed

For Production
/$ npm run seed-production


## Testing
To run test please run the following script:

To run all tests
/$ npm test

To run a specific test file
/$ npm test __tests__/index.test.js        etc


## Creating .env files required 
This project will require you to create your own .env files locally.

Please follow the below instructions:

-In you root directory create a file called .env.test file.
-It's contents should be 
    PGDATABASE=nc_news_test

-Also in your root directoy create a file called .env.development.
It's contents should be 
    PGDATABASE=nc_news

## Minimum versions 
Node.js     v20.5.1     
psql        14.9