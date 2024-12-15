const {addItem,listItem,removeItem} = require("../Controllers/itemController");
const express=require("express")
const itemRouter=express.Router();

itemRouter.post("/store",addItem);
itemRouter.get("/list", listItem);
itemRouter.post("/remove",removeItem);
module.exports=itemRouter;