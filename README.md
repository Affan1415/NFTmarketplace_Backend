>>nmp init(genral api)
>>npm install express@4.18.1(intsall express)
>>npm install -g nodemon(global nodes)
>>nodemon app.js (to start the server,automatically refresh when u save the code changes)
>>npm install morgan express(allow to identify what request user are making on your API if i want to some event on that request use this package and trigger that event)
>>npm i dotenv(to read from the .env file)
>>npm i mongoose@5.5.2 (for the data modeling and all the security)


>>start application:
(development)
npm start
(production)
npm install -g win-node-env(first install)
npm run start:prod

(thats how qwe going to import and delete the data)
>>node nft-data/data/import-data.js
(to import all data)
>>node nft-data/data/import-data.js --import
(to delete all data)
>>node nft-data/data/import-data.js --delete

(every single nft has its URL called slug)
>>npm i slugify

(npm packet utelize for validation)
>>npm i validator



(tool to debug our api)
>>nmp i ndb
>>npm run debug


(tool for encryption of passwords)
>>npm i bcryptjs


(package to work on authetication)
>>npm i jsonwebtoken

(create acc at nodemailer and a new project and a new inbox and also makeacc in ethereal email copy the nodemailer configuration from there)
>>npm i nodemailer

(seeting the rate limit how pany request a singel ip can make at ur api)
>>npm i express-rate-limit

(middelware to set couple of properties in our header)
>>npm i helmet


(to sanitize the data)
>>npm i express-mongo-sanitize
>>npm i xss-clean
(manage prams)
>>npm i hpp