require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const Article=require('./models/article');
const requireJWT=require('./middleware/auth');
const methodOverride=require('method-override');
const cookieParser=require('cookie-parser');
const app=express();

const authRouter=require('./routes/auth');
const articleRouter=require('./routes/articles');
mongoose.connect('mongodb://127.0.0.1:27017/blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(" Connected to MongoDB");
}).catch((err)=>{
    console.log("Failed to connect mongo");
})
app.use(cookieParser());
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'));

app.set('view engine','ejs');

app.listen(3000,()=>{
    console.log("Listening for requests");
});

app.get('/',requireJWT,async (req,res)=>{
    const articles=await Article.find().sort({createdAt: 'desc'});
    res.render('index',{articles: articles});
})
app.get('/dashboard',requireJWT,(req,res)=>{
    res.render('dashboard',{user: req.user});
})
app.use('/articles',articleRouter);
app.use('/',authRouter);