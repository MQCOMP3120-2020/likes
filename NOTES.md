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
the `package.json` scripts.  This can be used to change the behaviour of the scripts
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


## Front End vs Back End Testing

It turns out that mixing front-end and back-end tests in one repository is not simple. The
default configuration set up by `create-react-project` assumes that this is a front-end
only project and the test script (`react-scripts test`) will just look for tests in the
`src` directory for the front-end React code.   Jest also has different configurations
for front-end and back-end testing; in particular, the `jest-environment` setting ([documentation](https://jestjs.io/docs/en/configuration#testenvironment-string)) is 
set to `jsdom` to run tests that modify the DOM in the browser and to `node` for tests
that expect to run in node on the server side.   

I found a way to have both types of test in the same repository but I can't (yet)
run them all at the same time.  

To make the server side tests run you would normally set `testEnvironment: node` in 
the `jest.config.json` file, however this would then cobble the front-end tests. So instead,
we include the following at the top of every back-end test file:

```javascript
/**
 * @jest-environment node
 */
```
If we run jest as normal from `package.json` it will find both front-end and back-end 
tests and the front-end tests won't work (there might be a way to configure this 
but I've not found it yet).  So instead we modify the command to only look for 
tests in the `server` folder:

```
    "test": "cross-env NODE_ENV=test jest --verbose --coverage --testPathPattern server",
```

The last part of the command restricts which tests are run.  So now, `npm run test` will run the back-end tests as before. 

Front end tests are run using `react-scripts test` so I set up an alternate script for that:

```
    "testreact": "react-scripts test",
```
This will look for any tests in the `src` folder and run them in the right way to test the React code.  

These problems can be avoided by splitting your project into two repositories for front-end and back-end code. For anything more than a simple project, this is almost certainly the best option. In practice, you may have more than one front-end client for the service provided by your back-end, so decoupling them makes a lot of sense.


## Writing Front End Tests

Front end tests are testing a few different things:

 * that each component renders the HTML it should - under different input conditions
 * that components behave the way they should - button presses result in callbacks
 * that our services and other logic behave appropriately

Front-end code would normally run in a browser but we simulate this with Jest using
the jsdom runtime. This allows us to test all of the aspects above without having to 
make use of a browser.  

However, there's a final aspect that needs testing:

 * that our app behaves properly in the browser

 Jest isn't able to help with this - instead we would turn to a tool like [Cypress](https://cypress.io) which can automate End-to-End testing of our application by remote-controlling the browser. 

 ### Component Rendering

 To check that a component renders the right HTML we use the `render` function from
 `'@testing-library/react'`, this generates an object that we can then query to
 check that we get what we expect.  See my tests in [List.test.js](src/List.test.js) 
 for a simple example of this.   That test renders the `List` component with some
 sample data and checks that all of the elements in the list show up.  

 One option that Jest provides here is [snapshot testing](https://jestjs.io/docs/en/snapshot-testing) which saves a copy of the
 HTML generated by a component and checks whether it has changed since the last run. 
 This is useful to ensure that updates to your components don't alter the output 
 unexpectedly.  There's an example snapshot test in [List.test.js](src/List.test.js).

### Component Behaviour

Testing behaviour is also straightforward with Jest. The object returned by the `render`
function allows you to find form elements and buttons and invoke actions on them
with the `fireEvent` function. 

A big part of this kind of test is the use of mock functions.  The simplest example
is a function passed in to a component that is intended as a call back when some
action occurs.  For example in my `List` component I have an `addVote` function.
In my test I generate a mock function with `jest.fn()` and pass this in to the
component.  I can then test whether this function has been called an with what
arguments later on in my test.   

### Services and Application Logic

Part of my application is a service module that encapsupates calls to the back-end
API with axios.  Tests for this are just unit tests, quite similar to those we
wrote for the back end: call the function, make assertions about what it returns. 

However, since axios is involved we would normally have to have the back-end code
running to get a response.  Here we use another mock capability of jest to provide
a mock result from a function in the axios library.  In my tests [likes.test.js](src/services/likes.test.js) I use `axios.post.mockResolvedValue` to create a mock result from any
call to `axios.post`.   Then when my service code makes a call to this function, I know
what the result will be and no HTTP request is sent to the back-end code.  I can run
my service tests without any network access. 

Mocking is very important in these kinds of tests since it isolates the part of the code
you are testing from other libraries or resources - any bugs are going to be bugs in your
code.  You need to be certain that the mocked values you provide are correct however, 
since a mismatch could lead to real world bugs that your tests can't detect.  For this 
reason it is also important to do end to end testing with something like Cypress.


