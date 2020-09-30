// import models
const users = require("../models/users");

const usersCtrl =  () => {
   
   const _create =  async (req,res)=>{
        try{
            const postData = req.body;
            let doc =  new users(postData);
            let result  = await doc.save();
            res.status(200).send({status:200,message:"saved successfully"});
        }catch(ex){
            res.status(500).send({status:500,message:ex.message});
        }
   }; 
   const _list  = async (req,res) => {
    try{
        const result =  await users.find({is_active:1});
        res.status(200).send({status:200,responseContents:result,message:"fetched successfully"});
    } catch(ex){
      res.status(500).send({status:500,message:ex.message});
    }
   }
   const _getById  = async (req,res) => {
    try{
        const {_id} = req.query;
        const result =  await users.findOne({_id});
        res.status(200).send({status:200,responseContents:result,message:"fetched successfully"});
    } catch(ex){
      res.status(500).send({status:500,message:ex.message});
    }
   }
   const _updateList = async (req,res) =>{
       try{
            const postData = req.body;
            let result = await users.update({_id:postData._id},{$set:postData});
            res.status(200).send({status:200,responseContents:result,message:"updated successfully"});
        }catch(ex){
          res.status(500).send({status:500,message:ex.message});
       }
   }
   const _deleteList = async (req,res) =>{
        try{
            const {_id} = req.query;
            let result = await users.update({_id},{$set:{is_active:false}});
            
            res.status(200).send({status:200,responseContents:result,message:"deleted successfully"});
        }catch(ex){
        res.status(500).send({status:500,message:ex.message});
        }
    }
   return {
       create:_create,
       list:_list,
       getById:_getById,
       updateList:_updateList,
       deleteList:_deleteList 
   } 
}

module.exports = usersCtrl();