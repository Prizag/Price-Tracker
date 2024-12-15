
const itemModel=require('../Models/Item')
const addItem=async (req,res)=>{

 
    const item=new itemModel({
       title:req.body.title,
       price:req.body.price,
    
    })
    try{
     await item.save();
     res.json({success:true,message:"Item Added"})
    }catch(error){
      console.log(error);
      res.json({success:false,message:"Error"})
    }
 
 }
 
const listItem=async (req,res)=>{
    try{
        const items=await itemModel.find({});
        res.json({success:true,data:items})
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

const removeItem=async(req,res)=>{
    try{
        const item=await itemModel.findById(req.body.id);
        await itemModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Food Removed"});
    }catch(error){
       console.log(error);
       res.json({success:false,message:"Error"});
    }
    }
 module.exports={addItem,listItem,removeItem};