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
