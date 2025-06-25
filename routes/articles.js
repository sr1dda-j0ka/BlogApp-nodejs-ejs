const express=require('express');
const Article=require('./../models/article.js');
const {generateArticle}=require('./../utils/gemini.js');
const router=express.Router();


router.get('/new',(req,res)=>{
    res.render('new',({article: new Article()}));
})
router.get('/article-generator',(req,res)=>{
    res.render('article-generator',{ generatedArticle: null });
})
router.get('/edit/:id',async (req,res)=>{
    const article=await Article.findById(req.params.id);
    res.render('edit',{article})
})

router.get('/:slug',async (req,res)=>{
    const article=await Article.findOne({slug: req.params.slug});
    if(article==null){
        res.redirect('/');
    }
    res.render('show',{article:article})
})
router.post('/article-generator',async (req,res)=>{
    const topic=req.body.topic;
    try{
        const article= await generateArticle(topic);
        res.render('article-generator',{ generatedArticle: article });
    } catch(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
})
router.post('/',async (req,res,next)=>{
    req.article=new Article();
    next()
},saveArticleAndRedirect('new'))

router.put('/:id',async (req,res,next)=>{
    req.article=await Article.findById(req.params.id);
    next()
},saveArticleAndRedirect('edit'))

router.delete('/:id',async (req,res)=>{
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
})
function saveArticleAndRedirect(path){
    return async (req,res)=>{
        let article=req.article
        article.title= req.body.title
        article.description= req.body.description
        article.markdown=req.body.markdown

    
    try{
        article=await article.save();
        res.redirect(`/articles/${article.slug}`);
    }catch(err){
        console.log(err);
        res.render(`${path}`,{article: article});
    }
    
}}

module.exports=router;