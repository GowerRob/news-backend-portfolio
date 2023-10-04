# Backend API for accessing application data programmatically

# Link to hosted version of this project 
https://newsservicerg.onrender.com/

# Project description
This project is a hosted RESTful API that allows us, through using various endpoints, to interact with a database using CRUD operations.
The database holds information about news articles and has several related tables that interact to serve the data required.

# Instructions
The project will require several dependant packages to run.  Please find details of each below:

## Dependencies
dotenv : https://www.npmjs.com/package/dotenv

express : https://www.npmjs.com/package/express

pg : https://www.npmjs.com/package/pg

## Developer Dependencies

husky : https://www.npmjs.com/package/husky

jest : https://www.npmjs.com/package/jest

jest-extended : https://www.npmjs.com/package/jest-extended

pg-format : https://www.npmjs.com/package/pg-format?activeTab=readme

supertest : https://www.npmjs.com/package/supertest





# creating .env files required 
This project will require you to create your own .env files locally.

Please follow the below instructions:

-In you root directory create a file called .env.test file.
-It's contents should be 
    PGDATABASE=nc_news_test

-Also in your root directoy create a file called .env.development.
It's contents should be 
    PGDATABASE=nc_news