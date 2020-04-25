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
db.users.update({_id:ObjectId("5ea357c04c568f91dfa5a9e6")}, {$set: {"password":"#123456"}}) 
db.users.update({_id:ObjectId("5ea357c04c568f91dfa5a9e6")}, {$set: {"password":"$2a$10$KibQSZ.uQLADTuWbpiKFs.zTG/1YyuoBMPl81JwsqS8id2hn0Ta2u"}})  

validate password will only take a hashed password

