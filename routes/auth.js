const express=require('express');
const bcrypt=require('bcrypt');
const User=require('../models/user')
const jwt=require('jsonwebtoken')
const router=express.Router();
const JWT_SECRET=process.env.JWT_SECRET;

router.get('/register',(req,res)=>{
    res.render('register')
})
router.post('/register',async(req,res)=>{
    const {username,password}=req.body;
    const hashedPwd=await bcrypt.hash(password,10);

    try{
        await User.create({username,password: hashedPwd});
        res.redirect('/login');
    }catch(err){
        console.log(err);
    }
})

router.get('/login',(req,res)=>{
    res.render('login');
})
router.post('/login',async (req,res)=>{
    const {username,password}=req.body;
    const user=await User.findOne({username});
    if(!user){return res.send('user not found')}
    const match=await bcrypt.compare(password,user.password);
    if(!match){
        res.send('Password incorrect');
    }
    const token=jwt.sign({userId: user._id,username: user.username},JWT_SECRET,{expiresIn: '1h'});
    res.cookie('token',token,{httpOnly: true});
    res.redirect('/');
})
router.get('/logout',(req,res)=>{
    res.clearCookie('token');
    res.redirect('/login');
})
module.exports= router;