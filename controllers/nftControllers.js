// //>>comented this one bcz we no longer need our local data base
// // const fs = require("fs");

// // const nfts = JSON.parse(
// //   fs.readFileSync(`${__dirname}/../nft-data/data/nft-simple.json`)
// // );

// const NFT = require("./../models/nftModel");
// ////>>export so that we will be able to use them in our routes folder
// //>>check the id
// // exports.checkId = (req, res, next, value) => {
// //   console.log(`ID: ${value}`);
//   //>>no longer needed this bcz it wil be taken care by mongoose
//   // if (req.params.id * 1 > nfts.length) {
//   //   return res.status(404).json({
//   //     status: "fail",
//   //     message: "Invalid ID",
//   //   });
//   // }
// //   next();
// // };
// //>>check if user providing all the data for nft
// // exports.checkBody = (req, res, next) => {
// //   if (!req.body.name || !req.body.price) {
// //     return res.status(400).json({
// //       status: "fail",
// //       message: "Missing name and price",
// //     });
// //   }
// //   next();
// // };

// exports.getAllNfts = (req, res) => {
//   console.log(req.requestTime);
//   res.status(200).json({
//     status: "success",
//     requestTime: req.requestTime,
//     //>>local databse ke liye tha bhai
//     // results: nfts.length,
//     // data: {
//     //   nfts,
//     // },
//   });
// };
// // //POST METHOD
// exports.createNFT = (req, res) => {
//   // const newId = nfts[nfts.length - 1].id + 1;
//   // const newNFTs = Object.assign({ id: newId }, req.body);
//   // nfts.push(newNFTs);
//   // fs.writeFile(
//   //   `${__dirname}/nft-data/data/nft-simple.json`,
//   //   JSON.stringify(nfts),
//   //   (err) => {
//   //     res.status(201).json({
//   //       status: "success",
//   //       nft: newNFTs,
//   //     });
//   //   }
//   // );
// };
// // // GET SINGLE NFT
// exports.getSingleNFT = (req, res) => {
//   const id = req.params.id * 1;
//   // const nft = nfts.find((el) => el.id === id);

//   // if (!nft) {
//   //   return res.status(404).json({
//   //     status: "fail",
//   //     message: "Invalid ID",
//   //   });
//   // }

//   res.status(200).json({
//     status: "success",
//     // data: {
//     //   nft,
//     // },
//   });
// };
// // //PATCH METHOD
// exports.updateNFT = (req, res) => {
//   // if (req.params.id * 1 > nfts.length) {
//   //   return res.status(404).json({
//   //     status: "fail",
//   //     message: "Invalid ID",
//   //   });
//   // }

//   res.status(200).json({
//     status: "success",
//     data: {
//       nft: "Updating nft",
//     },
//   });
// };
// //DELET METHOD
// exports.deleteNFT = (req, res) => {
//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// };

// /// PART 2 ------------------------------

// const NFT = require("./../models/nftModel");

// // //>>javascript classes structure
// // class APIFeatures {
// //   //>>entire data query and the query(filter) as queryString
// //   constructor(query, queryString) {
// //     this.query = query;
// //     this.queryString = queryString;
// //   }

// //   filter(){

// //   }

// // }

// exports.getAllNfts = async (req, res) => {
//   try {
//     //>>cant display the whole data so we use query(filter it)
//     // //BUILD QUERY
//     //>>deconstructed the query ...
//     const queryObj = { ...req.query };
//     //>>first created the copy of queryobj and the excluding the queries
//     const excludedFields = ["page", "sort", "limit", "fields"];
//     excludedFields.forEach((el) => delete queryObj[el]);
//     // // console.log(req.query, queryObj);
//     // //ADVANCE FILTERING QUERY
//     let queryStr = JSON.stringify(queryObj);
//     //>>replace func   'g' all that replace
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//     //console.log(JSON.parse(queryStr));
//     //EXECUTE QUERY
//     //const query=NFT.find(queryObj);
//     //const query=NFT.find(JSON.parse(queryStr));
//     let query = NFT.find(JSON.parse(queryStr));
//     //gte getter in url
//     // // {difficulty: "easy", duration: {$gte: 5}}
//     // // { difficulty: 'easy', duration: { gte: '5' } }
//     // // { difficulty: 'easy', duration: { '$gte': '5' } }
//     //const nfts=await NFT.find(queryObj);
//     // //SORTING METHOD
//     if (req.query.sort) {
//       //>>multiple query slipt by "," and join by space
//       const sortBy = req.query.sort.split(",").join(" ");
//       console.log(sortBy);
//       query = query.sort(sortBy);
//     } else {
//       //>>if no query add default query (filrer data on basis of timestamp)
//       query = query.sort("-createdAt");
//     }

//     // //FIELDS LIMITING
//     //>>filter on basis of fields
//     if (req.query.fields) {
//       const fields = req.query.fields.split(",").join(" ");
//       query = query.select(fields);
//     } else {
//       //>>"-__v"internally created by mongoos so we gonna hide it from user
//       query = query.select("-__v");
//     }

//     // //PAGINATIONS FUNCTION
//     //>>displaying selective amount of nfts(in which page ur at and how manay data u want to display)

//     // // page=2&limit=3, page = 1, 1 -10, page 2, 11 -20, page 3, 21 -30
//     //>>converting page to no.*1 and also adding default to 1 if user dont send page same for skip
//     const page = req.query.page * 1 || 1;
//     const limit = req.query.limit * 1 || 10;
//     const skip = (page - 1) * limit;
//     //>>skip method

//     query = query.skip(skip).limit(limit);
//     //>>if page number is increased

//     if (req.query.page) {
//       //>>countDocuments from mongoose count doc
//       const newNFTs = await NFT.countDocuments();
//       if (skip >= newNFTs) throw new Error("This page dosen't exist");
//     }

//     const nfts = await query;

//     //console.log(req.query);
// //>>predefined the queray 
//     // const nfts = await NFT.find({
//     //   difficulty: "easy",
//     //   duration: 5,
//     // });
// //>>another way
//     //const nfts = await NFT.find()
//     //   .where("duration")
//     //   .equals(5)
//     //   .where("difficulty")
//     //   .equals("easy");
//     // /SEND QUERY
//     res.status(200).json({
//       status: "success",
//       results: nfts.length,
//       data: {
//         nfts,
//       },
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: "fail",
//       message: error,
//     });
//   }
// };
// //POST METHOD(create nft)
// //>>async: bcz we are looking for remote data base and sometimes erroe happend and it taskes time
// exports.createNFT = async (req, res) => {
//   //>.we can use this method but we gonna use another method to save to database
//   // const newNFT = new NFT({})
//   // newNFT.save();

//   try {
//     const newNFT = await NFT.create(req.body);
// //>>sending back response the nft created itself
//     res.status(201).json({
//       status: "success",
//       data: {
//         nft: newNFT,
//       },
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: "fail",
//       message: "Invalid data send for NFT",
//     });
//   }
// };

// // GET SINGLE NFT
// exports.getSingleNFT = async (req, res) => {
//   try {
//     //>>findbyid method of mongooes
//     const nft = await NFT.findById(req.params.id);

//     res.status(200).json({
//       status: "success",
//       data: {
//         nft,
//       },
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: "fail",
//       message: error,
//     });
//   }
// };
// // //PATCH METHOD
// exports.updateNFT = async (req, res) => {
//   try {
//     const nft = await NFT.findByIdAndUpdate(req.params.id, req.body, {
//       //>>any updates will be treated as the new
//       new: true,
//       runValidators: true,
//     });

//     res.status(200).json({
//       status: "success",
//       data: {
//         nft,
//       },
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: "fail",
//       message: error,
//     });
//   }
// };
// // //DELET METHOD
// exports.deleteNFT = async (req, res) => {
//   try {
//     await NFT.findByIdAndDelete(req.params.id);
//     res.status(204).json({
//       status: "success",
//       data: null,
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: "fail",
//       message: error,
//     });
//   }
// };

// /// PART 3 ------------------------------
 // //>>javascript classes structure
// const NFT = require("./../models/nftModel");
// class APIFeatures {
//   constructor(query, queryString) {
//     this.query = query;
//     this.queryString = queryString;
//   }

//   filter() {
//     //BUILD QUERY
//     const queryObj = { ...this.queryString };
//     const excludedFields = ["page", "sort", "limit", "fields"];
//     excludedFields.forEach((el) => delete queryObj[el]);

//     //ADVANCE FILTERING QUERY
//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//     this.query = this.query.find(JSON.parse(queryStr));

//     // this.query = NFT.find(JSON.parse(queryStr));
//     return this;
//   }

//   sort() {
//     if (this.queryString.sort) {
//       const sortBy = this.queryString.sort.split(",").join(" ");
//       console.log(sortBy);
//       this.query = this.query.sort(sortBy);
//     } else {
//       this.query = this.query.sort("-createdAt");
//     }
//     return this;
//   }

//   limitFields() {
//     if (this.queryString.fields) {
//       const fields = this.queryString.fields.split(",").join(" ");
//       this.query = this.query.select(fields);
//     } else {
//       this.query = this.query.select("-__v");
//     }
//     return this;
//   }

//   pagination() {
//     const page = this.queryString.page * 1 || 1;
//     const limit = this.queryString.limit * 1 || 10;
//     const skip = (page - 1) * limit;

//     this.query = this.query.skip(skip).limit(limit);

//     // if (this.queryString.page) {
//     //   const newNFTs = await NFT.countDocuments();
//     //   if (skip >= newNFTs) throw new Error("This page dosen't exist");
//     // }

//     return this;
//   }
// }

// exports.aliasTopNFTs = (req, res, next) => {
//   req.query.limit = "5";
//   req.query.sort = "-ratingsAverage,price";
//   req.query.fields = "name,price,ratingsAverage,difficulty";
//   next();
// };

// exports.getAllNfts = async (req, res) => {
//   try {
//     // //BUILD QUERY
//     // const queryObj = { ...req.query };
//     // const excludedFields = ["page", "sort", "limit", "fields"];
//     // excludedFields.forEach((el) => delete queryObj[el]);

//     // //ADVANCE FILTERING QUERY
//     // let queryStr = JSON.stringify(queryObj);
//     // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//     // let query = NFT.find(JSON.parse(queryStr));

//     //SORTING METHOD
//     // if (req.query.sort) {
//     //   const sortBy = req.query.sort.split(",").join(" ");
//     //   console.log(sortBy);
//     //   query = query.sort(sortBy);
//     // } else {
//     //   query = query.sort("-createdAt");
//     // }

//     //FIELDS LIMITING
//     // if (req.query.fields) {
//     //   const fields = req.query.fields.split(",").join(" ");
//     //   query = query.select(fields);
//     // } else {
//     //   query = query.select("-__v");
//     // }

//     //PAGINATIONS FUNCTION
//     // const page = req.query.page * 1 || 1;
//     // const limit = req.query.limit * 1 || 10;
//     // const skip = (page - 1) * limit;

//     // query = query.skip(skip).limit(limit);

//     // if (req.query.page) {
//     //   const newNFTs = await NFT.countDocuments();
//     //   if (skip >= newNFTs) throw new Error("This page dosen't exist");
//     // }

//     const features = new APIFeatures(NFT.find(), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .pagination();
//     const nfts = await features.query;

//     // /SEND QUERY
//     res.status(200).json({
//       status: "success",
//       results: nfts.length,
//       data: {
//         nfts,
//       },
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: "fail",
//       message: error,
//     });
//   }
// };
// // //POST METHOD
// exports.createNFT = async (req, res) => {
//   // const newNFT = new NFT({})
//   // newNFT.save();

//   try {
//     const newNFT = await NFT.create(req.body);

//     res.status(201).json({
//       status: "success",
//       data: {
//         nft: newNFT,
//       },
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: "fail",
//       message: "Invalid data send for NFT",
//     });
//   }
// };

// // GET SINGLE NFT
// exports.getSingleNFT = async (req, res) => {
//   try {
//     const nft = await NFT.findById(req.params.id);

//     res.status(200).json({
//       status: "success",
//       data: {
//         nft,
//       },
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: "fail",
//       message: error,
//     });
//   }
// };
// //PATCH METHOD
// exports.updateNFT = async (req, res) => {
//   try {
//     const nft = await NFT.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     res.status(200).json({
//       status: "success",
//       data: {
//         nft,
//       },
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: "fail",
//       message: error,
//     });
//   }
// };
// //DELET METHOD
// exports.deleteNFT = async (req, res) => {
//   try {
//     await NFT.findByIdAndDelete(req.params.id);
//     res.status(204).json({
//       status: "success",
//       data: null,
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: "fail",
//       message: error,
//     });
//   }
// };

// PART 4 ------------------------------

const NFT = require("./../models/nftModel");
const APIFeatures = require("./../Utils/apiFeatures");

exports.aliasTopNFTs = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,difficulty";
  next();
};

exports.getAllNfts = async (req, res) => {
  try {
    const features = new APIFeatures(NFT.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const nfts = await features.query;

    // /SEND QUERY
    res.status(200).json({
      status: "success",
      results: nfts.length,
      data: {
        nfts,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
//POST METHOD
exports.createNFT = async (req, res) => {
  try {
    const newNFT = await NFT.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        nft: newNFT,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

// GET SINGLE NFT
exports.getSingleNFT = async (req, res) => {
  try {
    const nft = await NFT.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        nft,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
//PATCH METHOD
exports.updateNFT = async (req, res) => {
  try {
    const nft = await NFT.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        nft,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
//DELET METHOD
exports.deleteNFT = async (req, res) => {
  try {
    await NFT.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

// //Aggregation Pipeline
//>>finding avg of different fields like avg of all nfts price and blah blah
 exports.getNFTsStats = async (req, res) => {
   try {
    //>>aggregate moongoes method
     const stats = await NFT.aggregate([
      {
        //>>match method in mongoes if we want to match some field
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        //>>we can segregate the data in the form of group
        $group: {
          // _id: "$ratingsAverage",
          //>>identifier _id pass  the thing on which we want the grouping
          _id: { $toUpper: "$difficulty" },
          numNFT: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          //>>will give the price of the entire nft
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      //>>this sort totally rely on group
      {
        $sort: { avgRating: 1 },
      },
      // {
      //   $match: {
      //     _id: { $ne: "EASY" },
      //   },
      // },
    ]);
    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

// //CALCULATING NUMBER OF NFT CREATE IN THE MONTH OR MONTHLY PLAN

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await NFT.aggregate([
      {
        //>>whatever property difiend in unwind it woill take it individualy
        $unwind: "$startDates",
      },
      {
        //>>match the year
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),//first month
            $lte: new Date(`${year}-12-31`),//to last month
          },
        },
      },
      {
        //>>grouping on basis of month and showing no. of nfts on that typical month 
        $group: {
          _id: { $month: "$startDates" },
          numNFTStarts: { $sum: 1 },
          nfts: { $push: "$name" },
        },
      },
      {
        //>>to add the month number
        $addFields: {
          month: "$_id",
        },
      },
      {
        //>>hide the field
        $project: {
          _id: 0,
        },
      },
      {
        //>>sort
        $sort: {
          numNFTStarts: -1,
        },
      },
      {
        //>>number of results limited to display
        $limit: 12,
      },
    ]);
    res.status(200).json({
      status: "success",
      data: plan,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
