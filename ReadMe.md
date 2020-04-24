## Current Setup

Index with jquery and bootstrap  
Server  
Database  
(Ununsed) Test Database  
Eslint configs  
Npm scripts - start, lint, test, cover  
Node travis config  
Log in page at index (100% Accessible)  
Log in submit redirects to (not yet protected) page  

## Make a User in Mongo

mongo  
use starter  
db.users.insertOne( { email: "a@b.com", password: "#123" } )  
db.users.find().pretty()  

