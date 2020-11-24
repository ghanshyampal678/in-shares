const express=require('express');
const File=require('../modals/file');
const route=express.Router();


route.get('/:uuid',async(req,res)=>{
  try {

    const file=await File.findOne({uuid:req.params.uuid})

    if(!file){
      return res.render('download',{
        error:'Link has been expired'
      })

    }

    const filepath=`${__dirname}/../${file.path}`;


    res.download(filepath);
    
  } catch (error) {
    return res.render('download',{
      error:'Something went wrong'
    })

    
  }
})

module.exports=route