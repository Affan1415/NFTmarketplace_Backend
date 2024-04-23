// const fs = require("fs");//>>>this fs model come along with express (using it to read/write the data from the data folder)
// const express = require("express");

// const app = express();//>>this variable app has all the functionality of express

// app.use(express.json());//>>middelware function of express to access any data in the form of json that pass 
// //>>>fs model load the data behind the scene here __dirname means cureent directory and from here we have to move to nft-data and blah blah to read the data
// //conver the data into javascript object:JSON.parse
// const nfts = JSON.parse(
//   fs.readFileSync(`${__dirname}/nft-data/data/nft-simple.json`)
// );
// //>>>.get from express allow us to make a request on the api to get the dat("/"means the main domain (URL),take the(qurrey the user making ,response of the server))
// // app.get("/", (req, res) => {
// //   res.status(200).send("Hellow i am nft marketplace api");
// // });
// //>>>sending data in the form of object json
// // app.get("/", (req, res) => {
// //   res.status(200).json({
// //     message: "Hellow i am nft marketplace api",
// //     api: "NFT Marketplace",
// //   });
// // });
// //>>>post write any document
// // app.post("/", (req, res) => {
// //   res.status(201).json({
// //     message: "Your data",
// //   });
// // });
// //GET REQUEST (get method)

// //console.log(nfts);
// //>>>v1 is the version (bcz its the titally new api) .API can have multiple versions(cant change versions instead if change in functionalities add another version like v2)/Nft resource(having all delete update blah blah fubctionality)
// app.get("/api/v1/nfts", (req, res) => {
//   res.status(200).json({
//     status: "success",
//     results: nfts.length,
//     data: {
//       nfts,
//     },
//   });
// });

// //POST METHOD

// app.post("/api/v1/nfts", (req, res) => {
// //console.log(req);//>>all the req log
// //console.log(req.body);//>>the data in the req body
// //>>adding new nft
//   const newId = nfts[nfts.length - 1].id + 1;
// //>>object.assign to add the data to already existing file
//   const newNFTs = Object.assign({ id: newId }, req.body);

//   nfts.push(newNFTs);//>>adding the newnft in our nfts
//   //>>function to write so that we have that in our data base
//   //>>path,convert data into string JSON.stringify,handel err
//   fs.writeFile(
//     `${__dirname}/nft-data/data/nft-simple.json`,
//     JSON.stringify(nfts),
//     (err) => {
//       res.status(201).json({
//         status: "success",
//         nft: newNFTs,//>>sending exact data back
//       });
//     }
//   );
//     //res.send("POST NFT");
// });

// // GET SINGLE NFT

// app.get("/api/v1/nfts/:id", (req, res) => {
// //console.log(req.params);//>>pass any parameter in our URL that will be available in this prams
// //>>multiply id with onw bcz it comes in frm of string and convert it into integer
//   const id = req.params.id * 1;
// //>>find function from express
//   const nft = nfts.find((el) => el.id === id);

// //   //   if (id > nfts.length) {
// //>>if the id is not found
//   if (!nft) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       nft,
//     },
//     });
//  });
// //>>updateing data we have two methods 1 is put and other is patch
// //>>put method upadte the entire data but patch dont it onli do that specific data
// //PATCH METHOD
// //not implimenting the writing functionality n all that here cuz its a long work to do it in our local database will do it at the end on our database but for now sending the response onli
// app.patch("/api/v1/nfts/:id", (req, res) => {
//   if (req.params.id * 1 > nfts.length) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       nft: "Updating nft",
//     },
//   });
// });

// //DELET METHOD

// app.delete("/api/v1/nfts/:id", (req, res) => {
//   if (req.params.id * 1 > nfts.length) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   }

//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// });

// const port = 3000;//>>crated the port for server
// //>>app.listen is how we create server in express(a port on which we want to create a server,call back functions)
// app.listen(port, () => {
//   console.log(`App running on port ${port}....`);
// });

//>>>>>>>>Part2
//>>refactoring:created the functions and call them in url
const fs = require("fs");
const express = require("express");
// const morgan = require("morgan");

const app = express();
app.use(express.json());
// app.use(morgan("dev"));

// //CUSTOM MIDDLE WARE
// app.use((req, res, next) => {
//   console.log("Hey i am from middleware function 👋");
//   next();
// });

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

const nfts = JSON.parse(
  fs.readFileSync(`${__dirname}/nft-data/data/nft-simple.json`)
);

const getAllNfts = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    results: nfts.length,
    data: {
      nfts,
    },
  });
};
// //POST METHOD
const createNFT = (req, res) => {
  const newId = nfts[nfts.length - 1].id + 1;
  const newNFTs = Object.assign({ id: newId }, req.body);

  nfts.push(newNFTs);

  fs.writeFile(
    `${__dirname}/nft-data/data/nft-simple.json`,
    JSON.stringify(nfts),
    (err) => {
      res.status(201).json({
        status: "success",
        nft: newNFTs,
      });
    }
  );
};
// // GET SINGLE NFT
const getSingleNFT = (req, res) => {
  const id = req.params.id * 1;
  const nft = nfts.find((el) => el.id === id);

  if (!nft) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      nft,
    },
  });
};
// //PATCH METHOD
const updateNFT = (req, res) => {
  if (req.params.id * 1 > nfts.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      nft: "Updating nft",
    },
  });
};
// //DELET METHOD
const deleteNFT = (req, res) => {
  if (req.params.id * 1 > nfts.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
};

app.get("/api/v1/nfts", getAllNfts);
app.post("/api/v1/nfts", createNFT);
app.get("/api/v1/nfts/:id", getSingleNFT);
app.patch("/api/v1/nfts/:id", updateNFT);
app.delete("/api/v1/nfts/:id", deleteNFT);

app.route("/api/v1/nfts").get(getAllNfts).post(createNFT);

// app
//   .route("/api/v1/nfts/:id")
//   .get(getSingleNFT)
//   .patch(updateNFT)
//   .delete(deleteNFT);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});

// /////PART 3 -----------------------

// const fs = require("fs");
// const express = require("express");
// const morgan = require("morgan");

// const app = express();
// app.use(express.json());
// app.use(morgan("dev"));

// //CUSTOM MIDDLE WARE
// app.use((req, res, next) => {
//   console.log("Hey i am from middleware function 👋");
//   next();
// });

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

// const nfts = JSON.parse(
//   fs.readFileSync(`${__dirname}/nft-data/data/nft-simple.json`)
// );

// const getAllNfts = (req, res) => {
//   console.log(req.requestTime);
//   res.status(200).json({
//     status: "success",
//     requestTime: req.requestTime,
//     results: nfts.length,
//     data: {
//       nfts,
//     },
//   });
// };
// //POST METHOD
// const createNFT = (req, res) => {
//   const newId = nfts[nfts.length - 1].id + 1;
//   const newNFTs = Object.assign({ id: newId }, req.body);

//   nfts.push(newNFTs);

//   fs.writeFile(
//     `${__dirname}/nft-data/data/nft-simple.json`,
//     JSON.stringify(nfts),
//     (err) => {
//       res.status(201).json({
//         status: "success",
//         nft: newNFTs,
//       });
//     }
//   );
// };
// // GET SINGLE NFT
// const getSingleNFT = (req, res) => {
//   const id = req.params.id * 1;
//   const nft = nfts.find((el) => el.id === id);

//   if (!nft) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       nft,
//     },
//   });
// };
// //PATCH METHOD
// const updateNFT = (req, res) => {
//   if (req.params.id * 1 > nfts.length) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       nft: "Updating nft",
//     },
//   });
// };
// //DELET METHOD
// const deleteNFT = (req, res) => {
//   if (req.params.id * 1 > nfts.length) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   }

//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// };

// ///------USERS
// const getAllUsers = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Internal server error",
//   });
// };

// const createUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Internal server error",
//   });
// };

// const getSingleUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Internal server error",
//   });
// };

// const updateUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Internal server error",
//   });
// };

// const deleteUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Internal server error",
//   });
// };

// const nftsRouter = express.Router();
// const usersRouter = express.Router();

// //ROUTER NFTs
// nftsRouter.route("/").get(getAllNfts).post(createNFT);

// nftsRouter.route("/:id").get(getSingleNFT).patch(updateNFT).delete(deleteNFT);

// //ROUTERS USERS
// usersRouter.route("/").get(getAllUsers).post(createUser);

// usersRouter
//   .route("/:id")
//   .get(getSingleUser)
//   .patch(updateUser)
//   .delete(deleteUser);

// app.use("/api/v1/nfts", nftsRouter);
// app.use("/api/v1/users", usersRouter);

// const port = 3000;
// app.listen(port, () => {
//   console.log(`App running on port ${port}....`);
// });

/////PART 4 -----------------------

// const express = require("express");
// const morgan = require("morgan");

// const nftsRouter = require("./routes/nftsRoute");
// const usersRouter = require("./routes/usersRoute");

// const app = express();
// app.use(express.json());

// if (process.env.NODE_ENV === "development ") {
//   app.use(morgan("dev"));
// }
// app.use(morgan("dev"));
// //SERVING TEMPLATE DEMO
// app.use(express.static(`${__dirname}/nft-data/img`));

// //CUSTOM MIDDLE WARE
// app.use((req, res, next) => {
//   console.log("Hey i am from middleware function 👋");
//   next();
// });

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

// app.use("/api/v1/nfts", nftsRouter);
// app.use("/api/v1/users", usersRouter);

// module.exports = app;
