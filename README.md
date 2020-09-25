# LoanPro Calculator

### Description
LoanPro calculator features
 - subtract
 - addition
 - divide
 - root
 - multiply
 - randomString

 - Is able to concatenate and make longer expressions like (5/44+44/44)

 - Everytime a calculation is made we "charge" a transaction fee. 
 - Rate table on the left displays how much you will be charged for each operation.
 - Ability to end session, redirected to home page where a new session can be created.
 - Green banner up top will show how much is due
 - Notification will show up on top of the Banner everytime a operation is made


 ## Prerequisites
 - Install Docker [here](https://docs.docker.com/get-docker/)
 - Node V10 or greater
 - Create a new .env file using .env.sample as a stub, fill out the database info. You can use the ones on the sample or create your own.

 ## Installation
 - Run `npm run docker`
 - Run migration files `npm run migrate`
 - Run seed for the db `npm run docker:seed`
 - After migration is done, stop the container `npm run docker:stop` and run it again 
 - App should then be running at http://localhost:3000
