
//>>if we ever create any data or uplaod any data it will go throug this model
const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const nftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A NFT must have a name"],
      unique: true,
      trim: true,
      //>>to ignore the fazool ka data added by user
      //>>validators
      maxlength: [40, "nft must have 40 character"],
      minlength: [10, "nft must have 10 character"],
      //validate: [validator.isAlpha, "NFT name must only contain Characters"],
    },
    slug: String,
    duration: {
      type: String,
      required: [true, "must provide duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "must have difficulty"],
      enum: {
        values: ["easy", "medium", "difficulty"],
        message: "Difficulty is either: easy, medium and difficulty",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "must have 1"],
      max: [5, "must have 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A NFT must have price"],
    },
    priceDiscount: {
      //THIS CAN ONLY WORK AT THE TIME OF CREATE not update
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price; // 200 > 100  20 < 100
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    summary: {
      type: String,
      //>>trim so there is no unnessaru spaces
      trim: true,
      required: [true, "must provide the summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    //>>take iamge as a string(name of the image)bcz its not good to load the image on db
    imageCover: {
      type: String,
      required: [true, "must provide the cover image"],
    },
    //>>array of strinfg bcz one nft can have multiple images
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      //>>hide it
      select: false,

    },


    startDates: [Date],
    secretNfts: {
      type: Boolean,
      default: false,
    },
  },
  //attaching virtual property
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

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
