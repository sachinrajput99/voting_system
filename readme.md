New Collection



Voting system api



POST
candidate voting endpoint
http://localhost:3000/candidate/vote/:candidateID
we send a token of the user in headers so as to sonfirm he is not voting more then once



Authorization
Bearer Token
Token
<token>
Query Params
Path Variables
candidateID
POST
user(voter) sign up
http://localhost:3000/user/signup
header token required



Body
raw (json)
json
{ "name": "manju Kumar",
"age": 30,
"mobile": "9872332210",
"email": "rajuasd@example.com",
"address": "123 ,ABC Street,XYZ City ",
"aadharCardNumber": "4567839234574839",
"password": "password123",
"role": "voter"
}
POST
create candidate
http://localhost:3000/candidate
header token require



PUT
candidate information update
http://localhost:3000/candidate/:candidateID



Path Variables
candidateID
DELETE
candidate delete
http://localhost:3000/candidate/:candidateID



Path Variables
candidateID
GET
candidate vote count
http://localhost:3000/candidate/vote/count



GET
candidate list
http://localhost:3000/candidate/list



POST
user(voter) sign up
http://localhost:3000/user/signup



POST
user(voter) login
http://localhost:3000/user/login



GET
user(voter) profile
http://localhost:3000/user/profile



PUT
user(voter) password change
http://localhost:3000/user/profile/password
