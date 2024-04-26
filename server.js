const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");
dotenv.config({ path: "./config.env" });
//>>enviornemnet variable
//console.log(app.get("env"));
//>>we have all the env in process.env dic name all the passwords blah blah

//console.log(process.env);
//>>create the string and replace the password with actual
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
//>>connecting database
//>>connect mathod pass the database and used some methods in the mongoose
mongoose
  .connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
  })
  .then((con) => {
    //console.log(con.connection);
    console.log("DB Connection Successfully");
  });

  //>>genral schema
//>>using the method from moongoes for retriving the data from the user(moved to models)
// const nftSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     //>validations
//     required: [true, "A NFT must have a name"],
//     unique: true,
//   },
//   rating: {
//     type: Number,
//     default: 4.5,
//   },
//   price: {
//     type: Number,
//     required: [true, "A NFT must have price"],
//   },
// });

 //>>this mongoos model refer to schema above
//const NFT = mongoose.model("NFT", nftSchema);

//>>thats how we create data nft in our database 
// const testNFT = new NFT({
//   name: "The Daulat Monkey",
//   rating: 3.2,
//   price: 567,
// });
// //>>inreturn of data saved we want to return a promise to confimr if its save or not
// testNFT
//   .save()
//   .then((docNFT) => {
//     console.log(docNFT);
//   })
//   //>>if anything goes wrong
//   .catch((error) => {
//     console.log("ERROR:", error);
//   });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});


//this is the change