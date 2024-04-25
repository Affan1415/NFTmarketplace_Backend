const express = require("express");
const nftControllers = require("./../controllers/nftControllers");
//>>can import it this way too
// const {
//   getAllNfts,
//   createNFT,
//   getSingleNFT,
//   updateNFT,
//   deleteNFT,
// } = require("./../controllers/nftControllers");

const router = express.Router();
//router.param("id", nftControllers.checkId);
//>>so whenever we got the id its only work for nfts not for user as it is onli defined in nftrouter
// router.param("id",(req,res,next,value)=>{
//   console.log(`ID: ${value}`);
//   next();
// })
//TOP 5 NFTs BY PRICE
// router
//   .route("/top-5-nfts")
//   .get(nftControllers.aliasTopNFTs, nftControllers.getAllNfts);

// //STATS ROUTE
// router.route("/nfts-stats").get(nftControllers.getNFTsStats);

// //GET MONTHLY PLAN
// router.route("/monthly-plan/:year").get(nftControllers.getMonthlyPlan);

// //ROUTER NFTs
router
  .route("/")
  .get(nftControllers.getAllNfts)
  //>>we have to check if user providing all data before creating nft
  //.post(nftControllers.checkBody, nftControllers.createNFT);
  .post(nftControllers.createNFT);

router
  .route("/:id")
  .get(nftControllers.getSingleNFT)
  .patch(nftControllers.updateNFT)
  .delete(nftControllers.deleteNFT);
//>>export route so we can recieve it in app.js
module.exports = router;
