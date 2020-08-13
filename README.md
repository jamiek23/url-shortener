# URL Shortener
Originally a project I was doing on [FreeCodeCamp](https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/url-shortener-microservice) 
for a bit of fun, I've expanded upon the original project to provide a 
full stack to run it via Docker.

What has been used is described below.

## Getting started
Once you've cloned this repository in your preferred tool, make `docker` 
and `docker-compose` are installed and simply issue `docker-compose up`.

For production using Docker Swarm, you use `docker stack deploy`.

## Node.js packages
### express
The main meat and gravy of the project. Provides a framework for building 
web applications, in a more convenient manner than the standard [`http.Server`](https://nodejs.org/api/http.html#http_class_http_server) API.

* [Official website](http://expressjs.com/)
* [NPM module](https://www.npmjs.com/package/express)

### mongoose / mongodb
`mongoose` is a database ORM that sits on top of the `mongodb` driver. 
This makes it nice and easy to create schemas and models for use within 
the project.

MongoDB was chosen as traditionally I stick to PostgreSQL databases, so 
wanted to explore the use of NoSQL databases. It was also the one used in 
earlier FreeCodeCamp projects. CouchDB would have been another option, 
along with many others.

* [Official website (mongoose)](https://mongoosejs.com/)
* [NPM module (mongoose)](https://www.npmjs.com/package/mongoose)
* [NPM module (mongodb)](https://www.npmjs.com/package/mongodb)

### cors (Cross-Origin Resource Sharing)
Allows restricted access to this service from a different origin domain.

Primarily this is used by FreeCodeCamp's solution validator, and isn't 
really used for anything else.

* [NPM module](https://www.npmjs.com/package/cors)

### body-parser
By default `express` doesn't attempt to parse the body in POST/PUT 
requests, so this extra package is needed to do this.

* [NPM module](https://www.npmjs.com/package/body-parser)

### nanoid
Used to generate unique short URLs, which is also used as a database ID. 
The length is 12 characters, using a 64-character set. (In regex terms: 
`[A-Za-z0-9\_\-]`) It is designed to be a small and cryptographically 
strong module, so I will likely be reusing this module elsewhere on "real"
projects.

According to the [Nano ID Collision Calculator](https://zelark.github.io/nano-id-cc/), 
with a given ID length of 12, there is a 1% probability of a duplicate ID 
being generated in 1000 years assuming a rate of 1000/IDs/hour. Were this 
a real application, some additional checks would probably need to be 
implemented or the ID length increased.

* [NPM module](https://www.npmjs.com/package/nanoid)

### dotenv
Will load environment variables from `.env` file. Very useful when running 
locally without `docker-compose`. (When using `docker-compose`, `.env` is 
loaded automatically by compose itself.)

* [NPM module](https://www.npmjs.com/package/dotenv)

## Docker images
### Node
Well if we're running Node.js code, we'll need something to run it on won't we? `12-slim` version of the `node` image is used, meaning it will have Node.js v12 (LTS release) on a minimal Debian install.

Potentially `12-alpine` could be used, but would likely need an additional 
build image with compilers included. `12-slim` contains just enough to get 
the one binary module (`mongodb`) built and working.

* [Docker Hub](https://hub.docker.com/_/node)

### MongoDB
Using one of the official Docker images for MongoDB, this provides a 
MongoDB server that the app can connect to. By default it runs in 
development mode - i.e. in-memory storage with no ACL.

* [Docker Hub](https://hub.docker.com/_/mongo)