# Testing Notes

As a prequel to testing I refactored the application a little to follow the
structure in the text.  I created [server/app.js](server/app.js) with 
the code that defines the Express application object. This is then imported
into [server/server.js](server/server.js) which runs the server and is the 
main entry point.   We do this so that we can also import the Express
application into the testing framework.  

Use Jest to run tests on both the server and client side code.  Jest provides
the `test()` function we use to write tests and the test runner finds tests 
in our project, runs them and reports the results. Jest is already installed
by create-react-app so you don't need to (and shouldn't) install it yourself.

Set up the project to use different run configurations by setting NODE_ENV in
the package.json scripts.  This can be used to change the behaviour of the scripts
between development, test and deployed versions.  Use the `cross-env` package
to set environment variables in a cross-platform way.

```
npm install cross-env
```

We use the `supertest` package to write our server side tests. It allows us to
send fake requests to the server code and look at the responses that are generated. 

```
npm install --save-dev supertest
```

We can now write tests in the server code, e.g. [api.tests.js](server/tests/api.test.js) 
and run them with `npm test`.

A major issue with testing the server side is that we need access to the database and
we need to both read and write to the database.  We can't use the production 
database since we can't predict what it contains, so we need a new database.  In the
text they just make a new database on the MongoDB Atlas server but here I'm going
to use a local in-memory database via the `jest-mongodb` package.   You can read the 
documentation for this package [here](https://github.com/shelfio/jest-mongodb) and it is
mentioned in the Jest documentation [here](https://jestjs.io/docs/en/mongodb). 

```
npm install --save-dev  @shelf/jest-mongodb
```

To use this I created [jest.config.js](jest.config.js) as per the documentation and
created the configuration file [jest-mongodb-config.js](jest-mongodb-config.js) which
describes which version of MongoDB we want and how it should be configured.  

I changed my code to use the environment variable `MONGO_URL` rather than `MONGODB_URI`
used in the text because that is the variable used by `jest-mongodb` to set the 
database URL for testing. 

Having done this, the first time I run my tests `jest-mongodb` will download and 
install MongoDB for my platform and start it up for the test run.  

The server side tests rely on the data in the database so I add a `beforeEach` 
function to load the sample data from my JSON file before every test is run.
This means I know what the database contains and can write tests to expect that data.  

I also add code to delete all the data in the `afterEach` function so that we reset
after each test.


## Async/Await Issues

Note the use of `await` functions in the examples in the text, this turns out to be
important in testing because we need to be sure when things are happening. 

I ran into problems when I tried to set up my database in the  `beforeEach` function. 
Initially I was just calling `.save()` for each record but this meant that the 
function would return before all of the data was actually stored.  In addition I was
deleting the data using `.deleteMany({})`  and the delete wasn't happening in time. 
This led to odd bugs in the tests. 

I then defined the function that creates sample data as `async` and similarly for the
`afterEach` function. Then I used `await` to ensure I waited for the data to be added
or deleted before returning. 

I also define each test in an `async` function and use `await` to get the response
data from the test call.


