
//>>if we ever create any data or uplaod any data it will go throug this model
const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

//>>virtual property : u dont want to store sudden data in db but u want it at the time of execution
nftSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//MONGOOSE MIDDLEWARE

//DOCUMNT MIDDLEWARE:this pre hooks only runs before .save() or .create() the data nfts
//>. prehook before data is saved
nftSchema.pre("save", function (next) {
  // console.log(this);
  //>>every single nft has its URL called slug
  //>>providing slug to te nft
  this.slug = slugify(this.name, { lower: true });
  next();
});
// //>>before the posthook
// nftSchema.pre("save", function (next) {
//   console.log("document will save....");
//   next();
// });
// //>.post hook after data is saved
// nftSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });

//QYERY MIDDLEWARE

//---------prehook
//>>cuz when ever we click get all nft so we have to filter out the data you dont want to show to others but to some specific members
//nftSchema.pre("find", function (next) {
//>>/^find/ apply on everything find methods
nftSchema.pre(/^find/, function (next) {
  this.find({ secretNfts: { $ne: true } });
  this.start = Date.now();
  next();
});
// //>>for rest of detele path findone
// nftSchema.pre("findOne", function (next) {
//   this.find({ secretNfts: { $ne: true } });
//   next();
// });

//-----post
nftSchema.post(/^find/, function (doc, next) {
  console.log(`Query took time: ${Date.now() - this.start} times`);
  // console.log(doc);
  next();
});

//AGGREATION MIDDLEWARE
//>>excluding some calculated(aggregated) data of secret nfts too
nftSchema.pre("aggregate", function (next) {
  //unshift to remove (simple java)
  this.pipeline().unshift({ $match: { secretNfts: { $ne: true } } });
  // console.log(this.pipeline());
  next();
});

const NFT = mongoose.model("NFT", nftSchema);

module.exports = NFT;
