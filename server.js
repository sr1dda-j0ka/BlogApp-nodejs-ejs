require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const Article=require('./models/article');
const methodOverride=require('method-override');
const app=express();

const articleRouter=require('./routes/articles');
mongoose.connect('mongodb://127.0.0.1:27017/blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(" Connected to MongoDB");
}).catch((err)=>{
    console.log("Failed to connect mongo");
})
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'));

app.set('view engine','ejs');

app.listen(3000,()=>{
    console.log("Listening for requests");
});

app.get('/',async (req,res)=>{
    const articles=await Article.find().sort({createdAt: 'desc'});
    res.render('index',{articles: articles});
})
app.use('/articles',articleRouter);