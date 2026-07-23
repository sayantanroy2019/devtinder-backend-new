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


    CONNECTION REQUEST APIs - WHY A SEPARATE SCHEMA
    now let's create the connection request APIs
    before writing the APIs, we have to think about where to store the connection requests
    one option is to store the connection requests inside the user model itself
    but if we store the connection requests in the user model, it will add a lot of complexities
    because the connection requests will have many corner cases and edge cases

    for example -
      a connection request may be in a hanging state (no response yet)
      someone may be interested
      someone may be ignored
      someone may be rejected
      someone may be accepted
      and so on

    so there can be many cases to handle - corner cases and edge cases
    to handle all these cases cleanly, we have to create a separate model for storing the connection requests

    this is the core idea -
    whenever we use / define a schema, the schema is meant to define something
    for example, the user schema defines the user
    in the same way, we have to create another schema for connection requests
    because this new schema will define the nature of the connection request -
      who sent it
      to whom it was sent
      whether it is in an interested, ignored, accepted, or rejected state
      and any other state the request may be in

    that is why we have to create a new schema for the connection requests
    keeping it in its own model keeps the user model clean and the connection-request logic isolated and easy to extend later

    HOW TO BUILD THE SEND CONNECTION REQUEST API
    few things to remember while writing this API -

    the connection request needs three main pieces of data -
      fromUserId  -> the user who is sending the request
      toUserId    -> the user who is receiving the request
      status      -> interested or ignored

    where do these values come from?
      fromUserId -> from the logged in user
                    because the user is authenticated using the userAuth middleware,
                    req.user is already available, so we just take req.user._id
                    we never trust the client to tell us who they are
      toUserId   -> from req.params (it comes in the URL, eg - /request/send/interested/:userId)
      status     -> from req.params also (eg - /request/send/:status/:userId)

    once we have all three values, we club them together into one object
    and then we pass that object into the ConnectionRequest model to create a new document
    after saving it to the DB, we send it back in the API response so the client can see what was created

    example flow -
      1. user A logs in -> gets a JWT cookie
      2. user A hits POST /request/send/interested/<userB_id>
      3. userAuth middleware verifies the cookie and attaches the user to req.user
      4. inside the route handler:
           const fromUserId = req.user._id
           const toUserId   = req.params.userId
           const status     = req.params.status
      5. create a new ConnectionRequest with these three fields and save it
      6. respond with the saved document


    VALIDATIONS WE NEED TO ADD TO THE SEND REQUEST API
    if we build the send request API in the most basic way, it has many flaws because there are no validations
    a real API needs to handle all these edge cases before we can call it a mature API

    validation 1 - status value check
      this API is only used to SEND a request, to tell the fact that "I am interested" or "I am ignoring"
      this API cannot be used to accept or reject a request - that is a different API (review)
      so the status value coming from req.params MUST be either "interested" or "ignored"
      if it is "accepted" or "rejected" (or anything else), the API should not work
      reject the request with an error before doing anything else

    validation 2 - no duplicate connection requests
      suppose person A sends a connection request to person B
      then later person A sends another connection request to person B
      this would create duplicate connection requests in the DB - we do not allow this
      rule -> if a connection request is already sent from A to B, we cannot send another one
              till the existing one is accepted or rejected

    validation 3 - reverse pending request
      another corner case is the reverse direction
      suppose person B has already sent a pending connection request to person A
      then person A should not be able to send a connection request to person B at the same time
      the existing pending request from B to A should be reviewed first
      rule -> if there is any existing request between A and B (in either direction), do not allow a new one

    validation 4 - both users must exist in the DB
      we need to check that both fromUserId and toUserId actually exist in the users collection
      if the toUserId does not exist, it means the user is sending a connection request to a person
      who is not present in the database - this should not happen
      so do a DB check (eg - User.findById(toUserId)) and throw an error if not found

    validation 5 - cannot send a request to yourself
      we have to make sure fromUserId and toUserId are different
      if they are the same, that means the same person is sending a request to themselves - not allowed
      add this check before saving the document


    INDEXING THE CONNECTION REQUEST COLLECTION
    once all the validations are added, the API is now a mature API
    but the next problem is performance / scale

    imagine -
      there are 1000 users
      each user sends connection requests to 100 different people
      that means the connection requests collection will have around 100,000 documents
      and this number only grows as the platform gets bigger

    every time we run our validation checks (eg - "does a request from A to B already exist?",
    "does a request from B to A already exist?", "list all requests received by user X"),
    MongoDB has to scan through these documents to find the matching ones
    without indexes, this is a full collection scan - very expensive at scale

    the fix is to add indexes on the fields we query the most
    for the connection request schema, the obvious candidates are -
      fromUserId
      toUserId
      a compound index on { fromUserId, toUserId } for the duplicate-check queries

    indexes make reads much faster (at the cost of slightly slower writes and a bit of extra storage)
    for a query-heavy collection like this, it is absolutely worth it

    rule of thumb -> any field you query, filter, or sort on frequently should be indexed


    HOW INDEXING WORKS AND WHEN TO USE IT
    to make query searching fast, we have to mark a field as an index
    once we define a field as an index, the database will wind itself up around that index
    internally, MongoDB builds a sorted data structure (a B-tree) for that field
    so when we search by that field, it does not scan every document - it jumps straight to the matching one

    example - in our user schema, email ID is a perfect candidate for indexing
      because email is unique
      and we do many searches by email (login, signup duplicate check, password reset, etc)
      that is why email should be indexed
      (note - declaring `unique: true` on a field also creates a unique index under the hood,
       so in our case the email field is already indexed)

    the core logic behind indexing -
      whatever field you are finding or searching by frequently, that field is the one you should index
      with the index in place, the search becomes much faster

    BUT - do not just index every field
    indexing comes with costs -
      every index takes up extra disk space
      every write (insert / update / delete) has to update all the indexes too,
        so writes get slower as you add more indexes
      indexes also use RAM - MongoDB tries to keep them in memory for speed

    so unnecessary indexing actually slows down the system overall
    index only where it is genuinely required -
      fields used in WHERE / find filters frequently
      fields used in sort
      fields used in joins / lookups

    rule - index where you read by it a lot, NOT just because the field exists


    REQUEST REVIEW API - PLANNING BEFORE WRITING CODE
    before writing any API, we should first write down the important steps and corner cases
    if we plan ahead, when we actually sit down to write the code it becomes very clear
    what needs to go where, and we miss fewer edge cases

    the request review API is what the RECEIVER of a connection request uses to accept or reject it
    route - POST /request/review/:status/:requestId
      :status     -> accepted or rejected
      :requestId  -> the _id of the ConnectionRequest document being reviewed

    inputs we already have once userAuth runs -
      req.user._id          -> the logged in user (must be the receiver)
      req.params.status     -> accepted or rejected
      req.params.requestId  -> the connection request _id

    validations / corner cases to handle (in order)

    validation 1 - status value check
      this API can ONLY change status to "accepted" or "rejected"
      it CANNOT be used to set status to "interested" or "ignored" - that is the send API's job
      so the value coming from req.params.status must be either "accepted" or "rejected"
      anything else -> reject the request

    validation 2 - request ID must exist in the DB
      the requestId coming from the URL must point to an actual ConnectionRequest document
      do a findOne / findById on ConnectionRequest using that requestId
      if no document is found -> throw an error (the request does not exist)

    validation 3 - the logged in user must be the toUserId
      we are reviewing a request, meaning the logged in user is the RECEIVER of that request
      so on the matched ConnectionRequest document, the toUserId field must equal req.user._id
      if the logged in user is the sender (fromUserId) and tries to accept their own outgoing request,
        that should not be allowed - they cannot review their own sent request
      so the rule is - only the toUserId of the connection request can review it

    validation 4 - the current status must be "interested"
      only requests in the "interested" state can be moved to "accepted" or "rejected"
      if the request is already "accepted", "rejected", or "ignored", we cannot touch it again
      this prevents weird transitions like rejected -> accepted, or accepting an already-accepted request

    once all four checks pass -
      update the status of the connection request to the new value
      save the document
      respond with the updated document

    we can also clean this up using a single MongoDB query that combines validations 2, 3, and 4 -
      ConnectionRequest.findOne({
        _id: requestId,
        toUserId: req.user._id,
        status: "interested",
      })
    if this returns null, we know one of the three conditions failed, and we can throw a generic error
    (this is also slightly more secure - we do not tell the attacker exactly which check failed)


    THOUGHT PROCESS - POST API vs GET API
    one important thing to remember -
    the thought process of creating a POST API is very different from creating a GET API
    whenever you are creating any API, look at it through the lens of "is this a POST or a GET?"
    because the security concerns on each side are completely different

    think of yourself as the SECURITY GUARD of the database
    once you take that mindset, the moment you see an incoming request,
    you will automatically know what to check based on the API type

    for a POST API (data coming IN)
      the user is sending data into your database
      a malicious user can try to put random / malformed / dangerous data into the DB
      so you have to -
        check every single field coming from the request
        validate types, formats, and allowed values
        sanitize anything that goes into the DB
        never trust req.body or req.params blindly
      goal -> protect the DATABASE from bad data going IN

    for a GET API (data going OUT)
      the user is asking your server to send data back
      a malicious user is trying to extract sensitive or unauthorized information OUT of the DB
      so you have to -
        decide what fields are SAFE to send back
        explicitly exclude private fields (password hash, JWT secrets, internal flags, etc)
        check whether the requesting user has the AUTHORIZATION to see that data at all
        return only the allowed fields, nothing more
      goal -> protect the DATABASE from leaking data going OUT

    short version -
      POST -> validate what's coming IN
      GET  -> filter what's going OUT

    if you keep this mental model, every API you write becomes more secure by default
    because you are reasoning about the threat model, not just the happy path


    LINKING COLLECTIONS WITH ref AND populate (USED IN REQUEST RECEIVED API)
    in MongoDB (via Mongoose) we can link two collections together using `ref` inside a schema field
    once two collections are linked, we can pull / populate data from the other collection
    using a single query - we do not need to make two separate DB calls

    how the linking works
      in the connection request schema, fromUserId and toUserId are of type ObjectId
      we tell mongoose that these ObjectIds actually point to documents in the User collection
      by adding `ref: "User"` to the field definition

      fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",            <- this is the link
        required: true,
      }

      now mongoose knows -> "the value stored here is the _id of a document in the User collection"

    how populate uses that link
      when we query the ConnectionRequest collection, the fromUserId field is just an ObjectId by default
      that ObjectId is not useful to the frontend - it does not tell us the user's name or photo
      so we use .populate() to swap that ObjectId for the actual user document

      ConnectionRequest.find({ toUserId: loggedInUserId, status: "interested" })
        .populate("fromUserId", "firstName lastName photoUrl about skills")

      the second argument to populate is the list of fields we want from the User document
      (always pick only the safe / useful fields - never populate the entire user doc,
       because that would leak the password hash and other sensitive fields - remember the GET API rule)

    why this matters for the request RECEIVED API
      the request received API has to return the list of connection requests
      where the logged in user is the toUserId AND the status is "interested"
      but the frontend cannot do anything useful with just an ObjectId in fromUserId
      it wants to show -> "John Doe wants to connect with you" with John's photo
      that is exactly what populate gives us

    short version -
      ref       -> defines the link between two collections at the schema level
      populate  -> uses that link at query time to pull data from the other collection
      together  -> single query, joined data, clean API response

    this is the MongoDB / Mongoose equivalent of a SQL JOIN, just done at the application layer
    important - always restrict what fields you populate, never blindly populate the whole document


    REMEMBER - ref AND populate
    these two are very important concepts to remember -
      ref       -> declares the link between two collections at the schema level
      populate  -> uses that link at query time to fetch the linked document's data

    almost every real-world API in this project (and in any social / relational backend) will need them -
      showing requests received with the sender's name and photo
      showing your list of connections with their profile info
      showing a feed of users with their details
      any time one document references another - you will use ref + populate

    so internalize these two -> they are the backbone of how Mongoose handles relationships


    FEED API - WHAT TO SHOW AND WHAT TO HIDE
    the feed API is the most important user-facing API
    when a user opens the app, the feed is what they see -
    a list of "cards" of other users they can swipe interested / ignored on

    the thinking behind the feed -
    any user should be able to see ALL other users on the platform, EXCEPT for the following -

    exclusion 1 - the logged in user himself
      the feed should never show your own card to yourself
      so exclude req.user._id from the result set

    exclusion 2 - the logged in user's existing connections
      people you are already connected to (status: accepted) should not appear in the feed
      no point showing someone you have already matched with

    exclusion 3 - the people the logged in user has ignored
      if you swiped ignored on someone, you should not see them again
      they are already in a ConnectionRequest doc with status: "ignored"

    exclusion 4 - the people the logged in user has sent any request to
      if you have already sent an "interested" or "ignored" request to someone,
      they should not show up in your feed again until that request is resolved

    exclusion 5 - the people the logged in user has received any request from
      if someone has already sent you a request, they should appear in your "requests received" list,
      not in the open feed - so exclude them from the feed too

    short version -
      hide ANY user that has any existing ConnectionRequest with you (in either direction)
      hide yourself
      show everyone else

    how to build the query (the approach)
      step 1 - fetch all ConnectionRequest docs where the logged in user is fromUserId OR toUserId
               (these are all the people you already have any kind of interaction with)
      step 2 - from these docs, collect all the OTHER userIds involved
               (the userId that is NOT yours, for each connection request)
      step 3 - put them all in a Set (to dedupe) - call it hiddenUsersFromFeed
      step 4 - also add the logged in user's own _id to that set
      step 5 - query the User collection -
                User.find({ _id: { $nin: Array.from(hiddenUsersFromFeed) } })
                ($nin = "not in" - excludes all the userIds in the hidden set)
      step 6 - return only safe profile fields (firstName, lastName, photoUrl, age, gender, about, skills)
               remember the GET API rule - filter what goes OUT, never leak password / email

    pagination is also important here (for later)
      a feed can have thousands of users - we should not send all of them at once
      accept ?page=1&limit=10 as query params and use .skip() / .limit() in the query
      this keeps the API fast and the response small


    FEED API - IMPLEMENTATION APPROACH (RECAP)
    putting it all together, the steps we are going to take in the feed API are -
      step 1 - find ALL the connection requests where -
                 fromUserId is the logged in user, OR
                 toUserId is the logged in user
               this gives us every user the logged in user has any kind of interaction with
      step 2 - from those connection requests, collect the OTHER userIds (not yours)
               and put them all in a Set - we will call it "hideUsersFromFeed"
               (Set is used so duplicates are automatically removed)
      step 3 - now we know exactly which users to HIDE from the feed
      step 4 - query the User collection and display ALL users EXCEPT the ones in hideUsersFromFeed
               (also exclude your own _id so you do not see yourself)


    PAGINATION ON THE FEED API
    once the feed is working, the next thing to add is pagination
    because in production we will have thousands of users -
    sending all of them in one response would be slow and waste bandwidth

    pagination uses two query parameters -
      limit  -> the number of users to return in one page (eg - 10 users per page)
      page   -> which page the user is asking for (eg - page 1, page 2, page 3, ...)

    how page and limit work together -
      if limit = 10 and page = 1  -> skip 0 users, return the next 10  (users 1 - 10)
      if limit = 10 and page = 2  -> skip 10 users, return the next 10 (users 11 - 20)
      if limit = 10 and page = 3  -> skip 20 users, return the next 10 (users 21 - 30)
      formula -> skip = (page - 1) * limit

    in MongoDB / Mongoose, two important functions handle this -
      .skip(n)   -> skip the first n documents in the result
      .limit(n)  -> return only the next n documents after the skip

    example -
      const page  = parseInt(req.query.page)  || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip  = (page - 1) * limit;

      const feed = await User.find({ _id: { $nin: hiddenUsersArray } })
        .select("firstName lastName photoUrl age gender about skills")
        .skip(skip)
        .limit(limit);

    important - always cap the limit on the server side (eg - max 50)
      because a malicious user could send ?limit=1000000 and try to dump the whole DB
      (remember the GET API security guard rule - filter what goes out)

    short version -
      .skip()  + .limit() = pagination
      page tells you WHICH chunk, limit tells you HOW BIG the chunk is
      always sanity-check the values coming from req.query


    CORS ERROR - WHAT IT IS AND HOW TO FIX IT
    once we start connecting our frontend (eg - a React app) to this backend,
    we will hit something called a CORS error
    CORS stands for Cross-Origin Resource Sharing

    what is "origin"?
      an origin is basically the combination of protocol + domain + port
      eg - http://localhost:3000 is one origin
      eg - http://localhost:5173 (frontend) is a different origin

    what is the CORS error?
      it is a browser-enforced security feature
      when a request is made from domain X to domain Y, and X and Y are DIFFERENT domains,
      the browser does not allow it by default - it blocks the response and shows a CORS error

      example -
        request from abc.com -> abc.com   (same domain)        => no error, browser is happy
        request from abc.com -> xyz.com   (different domain)   => CORS error, browser blocks it

    why does the browser do this?
      to protect users from malicious sites making unauthorized requests
      to other sites on their behalf (using their cookies, tokens, etc)
      it is a frontend-side security check - the backend never sees the request blocked

    how to fix it on the backend
      the backend has to explicitly tell the browser -
      "yes, I allow this other origin to talk to me"
      this is done via special CORS response headers (eg - Access-Control-Allow-Origin)

      easiest way in Express -> install the cors npm package
      step 1 -> npm install cors
      step 2 -> require it and add it as a middleware

      const cors = require("cors");
      app.use(cors({
        origin: "http://localhost:5173",   // the frontend origin
        credentials: true,                 // allow cookies (needed because we use JWT in cookies)
      }));

      IMPORTANT - add this middleware as the FIRST middleware, ABOVE all other middlewares
      because CORS headers have to be attached BEFORE express.json, cookieParser, routes etc
      if you put it later, some requests (especially OPTIONS preflight) will not get the CORS headers

    in production
      do NOT use origin: "*" with credentials -> the browser will block it
      always set a specific allowed origin (eg - https://yourapp.com)
      or use a function/array if you want to allow multiple origins

