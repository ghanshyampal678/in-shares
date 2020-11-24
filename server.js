const express=require('express');
const ejs=require('ejs');
const expressLayouts=require('express-ejs-layouts');
const mongoose=require('mongoose');
const path=require('path');
const { urlencoded } = require('express');
const app=express();
const dotenv=require('dotenv');

// Load env vars
dotenv.config({ path: './config/config_env' });


//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

//Body parser

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//EJS Layouts
app.use(expressLayouts);
app.set('view engine', 'ejs');




const db='mongodb+srv://rpmax:ghanshyam123@sample1.zhgno.mongodb.net/FileUploadAndDownload?retryWrites=true&w=majority'

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));



// Mount routes:
app.use('/api/files',require('./routes/files'))
app.use('/files',require('./routes/show'));
app.use('/files/download',require('./routes/download'));

PORT=process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App is listening on the port ${PORT}`);
});