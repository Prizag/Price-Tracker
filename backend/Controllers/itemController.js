
const itemModel=require('../Models/Item')
const userModel = require('../Models/User')
const addItem=async (req,res)=>{
    const { title, price, url, userId } = req.body;
    try{
    const item=new itemModel({
        title,
        price,
        url
    })
    //  await item.save();
     console.log("user ID:",userId)
     const user = await userModel.findById(userId);
     if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.items.push(item._id);
    await user.save();
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
        const {itemId,userId} = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        user.items = user.items.filter(item => item.toString() !== itemId);
        await user.save();
        await itemModel.findByIdAndDelete(itemId);
        res.json({ success: true, message: 'Item Removed' });
    }catch(error){
       console.log(error);
       res.json({success:false,message:"Error"});
    }
    }
 module.exports={addItem,listItem,removeItem};