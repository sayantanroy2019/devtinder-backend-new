app.use 1st parameter ->route , second parameter route handler(function) , , 3rd ......parameteres can be more route handlers
app.use
(
    "/user",
    (req,res) =>{
        res.send("1st Route Handler")
    },
    (req,res) => {
        res.send("2nd route handler")
    }
);
user sends request 1st response will be sent ->connection closed 2nd route handler will not work
user sends request and suppose there is no 1st response then it will get hanged
user sends request and in 1st handler (req,res,next) next() then it will pass on to next handler
if res sent then next is present then it will eventually move on to next handler and a small error will show that response already sent so response from this handler cannot be sent

all the request handlers before the request handler which actually handles the request are called middlewares
middlewares can be used for checking wether the request is authorised or not
generally middlewares is used for writing use becoz it wants to use get post put etc
ex -> if you write app.use("/admin") then for any admin end point starting with /admin/......  request has to pass through this middleware
error handling
generally everything should be written inside try catch
you can handle error using app.use() err should be the first parameter
app.use("/",(err,req,res))

create a config folder and all the configuration files here

mongoose library we will use to connect nodejs with mongodb

first require then create a function such that whenever we call that function database connection will happen 
mongoURI is the base url for the cluster , inside the cluster there will be many databases 
the right process is first connect to the database then listen on to the server

first require mongoose ,then you need to model your database
create a schema - schema is a function on top of mongoose , after creating schema create a model -> mongoose.model(name of the model , name of the schema)
schema is basically the definition of a model and using this model we can create new instances

route should be the name of the api

devtinder is the database , users is the collection in which documents are present

__v and _id both fields are created by mongodb automatically

till now you were feeding hard data and saving it in the databasenow i want to make it dynamicallly , for that you need a middleware which will convert the json data to a javascript object so that it can be passed into model and it can be saved in the databse
so this middleware is already present knownas express json

if u do this app.use(()=>{

}) it will handle all the routes

whenever you are using a db operation it u should use async await
findOne() returns the first document that matches the query, based on MongoDB's natural order (typically insertion order on a standard collection without a custom sort).

put is full resource replacement and patch is replacing only the resource fields you want to change


Data Sanitisation and schema validation
rn our db is very vulnerable ,so we need to do some validation checks now 
we need to have strict checks while inserting the data into db
we will add some strict checks in the database schema
add default , required , checks for emails ,trim , 
validate() method by default will only be called when a object/document is created(eg- it will be called during signup but not during updation)
you will have to enable it to run on updates also
go to patch -> runvalidators:true
suppose i am updating my user i dont want its email id to be changed , how to do that ?
i have to do an API level validation
few things i want it to update ad few things i dont want it to update so you have to do validation for that also
whenever you are getting a body from a request always sanitize it , always validate it .
add validation to everything
U may not have UI validation but u shaould always have backend validation
setting up validator for email in schema 
u can create validator function for various fields
never trust req.body


ENCRYPTING PASSWORDS
passwords should not be stored in plain text in database, so it should be stored in a hash format
so now lets improve the sign up api
  in signup api -> first validate the data , then encrypt the password
  u should create helper functions to do all these activities like validation , encrytpion , etc
  creating validate helper function->
    create utils and then inside utils create the helper functions
    during signup we receive first name, last name, email ID and password from the request body, so each of these fields has to be validated inside the validate helper function
    for first name and last name -> check whether first name is present or last name is present. If they are not present then throw an error
    for email ID -> check whether the email ID is a valid email ID or not (use validator library), if not valid throw a new error
    for password -> check whether the password is a strong password or not (use validator.isStrongPassword), if it is not strong throw a new error
    basically if any of these checks do not pass, throw a new error so that the signup api can catch it and respond accordingly

  now after the validation is done we will encrypt the password
  for password encryption there is a famous npm package called bcrypt.js
  so after that you need to install bcrypt, then you have to require it, and then you can use it
  from the body extract the password and then pass it through the bcrypt function and give the number of salt rounds
  the more amount of salt rounds, the more strong the password is, but it takes some time to create that password
  so if you increase the number of salt rounds, the time will increase
  give the number of salt rounds in the middle (as the second argument)
  once you get the password hash, then store it / save it in MongoDB

  after that, we will create a login API similar to the signup API
  so login API will be a POST API
  in the login API, email and password will be sent
  and then inside the API, the logic we will build is:
    first, the email ID will be checked - whether it is valid or not, and whether it is present in the DB or not
    after checking the email ID, if it is present in the DB, we will fetch the password corresponding to that email ID
    we will compare using bcrypt.compare - the password which is coming in the request and the password present in the DB
    based on whether that comparison is true or false, we will tell whether login is successful or not


    AUTHENTICATION , JWT AND COOKIES
    whenever a user comes and hits the server with an API, a connection is established between the server and the user
    the protocol is TCP protocol
    so the user requests something to the server, and then the server responds something to the user
    and after the response, the connection breaks
    in similar ways, other users also interact with the server in this same fashion

    now what happens when the user logs in to the server?
    whenever a user logs into the server using email and password:
      the user sends a login request to the server
      the server gives back a JWT token to the user
      the user stores it in its browser
    from next time, whenever the user tries to do something - like access the profile, send a connection request, or update something in the database -
    every action the user wants to do / every request the user sends to the server, is sent along with this JWT token
    and then the JWT token is validated on the server side

    one thing to remember -
    when the JWT token is sent by the server, the JWT token is sent inside a cookie
    so the cookie is sent to the user by the server
    and whenever further requests are made, the cookie is also sent with each request
    and then the cookie is validated at each request
    this is how the things work
    the cookie may also have an expiry time
    remember - to read a cookie, we need a middleware called cookie-parser

    CREATING A JWT TOKEN
    to create a token, we use an npm package called jsonwebtoken (jwt)
    a JWT token has three parts in it:
      the header
      the payload
      the signature
    the payload contains the security information and the signature contains information to validate the token

    so basically to create a JWT token we use jwt.sign()
      in the first parameter, we give the field that needs to be hidden (eg - user id)
      in the second parameter, we give a password / secret that only the server knows
    once you give these two parameters, the JWT token will be created, which will consist of the user ID (if user id is the field you have hidden) and also the secret

    this JWT token will be sent to the user inside a cookie using res.cookie("token", token)

    USER AUTHENTICATION MIDDLEWARE
    so now we will create a middleware called user authentication
    in that middleware, it is responsible for authenticating the user

    EXPIRING THE JWT TOKEN
    now we will see how we can expire the JWT token
    for expiring the token, you have to expire it while signing the token
    so when you do jwt.sign(), in the third parameter you have to give the expiry

    MONGOOSE SCHEMA METHODS
    now let's dive into mongoose schema methods
    so what happens is that the user schema defines all the users
    we can attach some methods on the user schema, which every user needs to follow
    basically, there are few things related to users which are very closely related to the user
    for example, every user will have its own unique JWT token
    so this creation of JWT token for every user, we can offload it to some helper functions in the mongoose schema using mongoose methods (schema.methods)

    normally, everything is right within the app.js code, but it is not necessary to write the JWT token creation logic inside app.js
    you can offload it directly to the user schema
    when the user is fetched / available, the JWT token can be created using mongoose's helper functions (eg - user.getJWTToken())

    one thing to remember -
    the "this" keyword does not work inside arrow functions
    so you have to define these schema methods in the traditional way (using the function keyword), and inside that you can use "this"


    API DESIGN & EXPRESS ROUTER
    now let's finalize some names of the APIs, how we will pass the data, and what will be the input/output of each API
    to handle the APIs in a proper way, we create an Express Router, and then we group / handle the APIs using Express Router

    list of APIs we are going to build:

    Auth Router (authRouter):
      POST   /signup
      POST   /login
      POST   /logout

    Profile Router (profileRouter):
      GET    /profile/view
      PATCH  /profile/edit
      PATCH  /profile/password      (to change/forgot password)

    Connection Request Router (connectionRequestRouter):
      POST   /request/send/interested/:userId
      POST   /request/send/ignored/:userId
      POST   /request/review/accepted/:requestId
      POST   /request/review/rejected/:requestId

    User Router (userRouter):
      GET    /user/connections        (list of your connections)
      GET    /user/request/received  (incoming connection requests)
      GET    /user/feed                    (profiles of other users on the platform)

      statuses - interested,ignores,accepted,rejected

    code should be cleaner , modular , testable 

    IMPORTING ROUTERS IN APP.JS
    after creating the routers in the routes folder / files, you have to import the routers in app.js
    so that app.js knows in which route it has to send the request when a specific request is coming

    also remember one thing -
    app.use is same as router.use
    app.use / app.get / app.post is same as router.use / router.get / router.post
    so it is almost the same thing

    but to make the code cleaner, and to follow the separation of concerns, we separate the routers into a different folder and file

    
  


