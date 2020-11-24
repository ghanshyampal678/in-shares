const express=require('express');
const multer=require('multer');
const router=express.Router();
const path=require('path');
const File=require('../modals/file');
const {v4:uuid4}=require('uuid');
const route = require('./show');

let storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'uploads/')
  },
  filename:(req,file,cb)=>{
    const uniqueName=`${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
    cb(null,uniqueName);
  }
})

let upload=multer({
  storage,
  limit:{
    fileSize:1000000*100,
  }
}).single('uploadFile');

router.get('/',(req,res)=>{
  res.render('upload');
})

router.post('/',(req,res)=>{

      //Store file
      upload(req,res,async (err)=>{

      //Validate request
        if(!req.file){
          return res.render('upload',{error:'All fields are required '});
        }
       
        
      //Store into database

      const file=new File({
        filename:req.file.filename,
        uuid:uuid4(),
        path:req.file.path,
        size:req.file.size,
      });
        
      const response=await file.save();
      return res.render('send',{
        file:`${process.env.APP_BASE_URL}files/${response.uuid}`
      });

      })

     
});


router.post('/send',async(req,res)=>{

  console.log(req.body)
  const {uuid,emailTo,emailFrom}=req.body;

  if(!uuid || !emailTo || !emailFrom){
    return res.status(422).send({error:"All fileds are required"})
  }

  const file=await File.findOne({uuid:uuid});

  if(file.sender){
    return res.status(422).send({error:"Email already sent"})
  }

  file.sender=emailFrom;
  file.receiver=emailTo;
  const response=await file.save();

  //Sendmail
  const sendmail=require('../services/emailService')
  sendmail({
    from:emailFrom,
    to:emailTo,
    subject:'inShare file sharing',
    text:`${emailFrom} shared a file with you`,
    html:`
    <h3>${emailFrom} shared a file with you</h3>
    <h3>Download Link:${process.env.APP_BASE_URL}/files/download/${file.uuid}</h3>
    <h2>Size:${parseInt(file.size/1000)} KB</h2>
    <h2>Expires In:24hr</h2>
    `,
  })

  res.status(200).send({success:"Email has send"});


})

module.exports=router;