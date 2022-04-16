# Social Media Link Traffic Analysis


## Author
- [Jacky Lee Chi Ho](https://github.com/u3578552)

## Dev Environment
- NodeJS **v16.13.1**
- Project is created with [npx express-generator](https://www.npmjs.com/package/express-generator)

## Plugins/Modules Used
- Nodemon @2.0.15
- ExpressJS @4.16.4
- Express-Generator @4.16.1
- Monk @7.3.4
- Monkeys-Referrer @1.0.1
- Store2 @2.13.2
- Cookie-Parser @1.4.6

## Installation & Execute

Use either one of the commands below in the main directory of the application.<br>
Using Nodemon will auto-restart the Node App upon changes made to the JS Files.

### **ONLY EXECUTE GENERATE_DB.JS FOR FIRST TIME SETUP**
Execute the first command in the directory of the installation instance of MongoDB<br> 
Execute the second command in the directory of the project 
```
./bin/mongo PathToDirectory/generate_db.js
npm install
```

To Run the project, run either of the following command in the directory.
```bash
node app.js
```
```bash
nodemon app.js
```

## Usage
__Run the command above and head to__ <br>
Access http://localhost:8081/visit  to add counts to the link method<br>
Access http://localhost:8081/analytics to see the real-time data stored in the MongoDB Database

## License
[MIT](https://choosealicense.com/licenses/mit/)