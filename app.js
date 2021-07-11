const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const methodOverride = require("method-override")

const authRoutes = require("./routes/authRoutes");
const Hubino = require("./models/hubino");
const  cookieParser = require('cookie-parser');
const {requireAuth, checkUser} = require('./middleware/authMiddleware')

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(methodOverride('_method'))


// middleware
app.use(express.static('public'));

// view engine
app.set('view engine', 'ejs');
// database connection
mongoose.connect("mongodb://localhost:27017/AuthDemo",{ 
    useNewUrlParser: true,  
    useCreateIndex : true,
    useUnifiedTopology: true
 });


const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", ()=>{
    console.log("Database Connected !");
});


// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));

app.get('/hubinoEmployees',async (req, res) => {
 const hubino = await Hubino.find({});
 res.render('hubino/employees',{hubino})
});


app.get('/hubinoEmployees/new',requireAuth,(req,res) =>{
  res.render('hubino/new');
 })

 app.post('/hubinoEmployees/',async(req,res) =>{
    const hubino = new Hubino(req.body.hubino);
    await hubino.save();
    res.redirect('/hubinoEmployees/');
 })

app.get('/hubinoEmployees/:id',requireAuth,async (req, res) => {
  const hubino  = await Hubino.findById(req.params.id)
  res.render('hubino/show',{hubino});
 });

 app.get('/hubinoEmployees/:id/edit',requireAuth,async(req,res)=>{
   const hubino = await Hubino.findById(req.params.id)
   res.render('hubino/edit',{hubino});
  // res.send("edit page ")
 })

 app.put("/hubinoEmployees/:id",  async(req, res) => {
    const {id} = req.params;
    const hubino = await Hubino.findByIdAndUpdate(id, {...req.body.hubino});
    res.redirect(`/hubinoEmployees/${hubino._id}`) ;
 })

 app.delete('/hubinoEmployees/:id', requireAuth,async(req, res) =>{
   const {id} = req.params;
   await Hubino.findByIdAndDelete(id);
   res.redirect("/hubinoEmployees")

 })



app.use(authRoutes);
app.listen(3000, () => {
  console.log("SERVING YOUR APP!");
});