const jwt=require('jsonwebtoken')
const JWT_SECRET=process.env.JWT_SECRET;
const requireJWT=(req,res,next)=>{
    const token=req.cookies.token
    if(!token) return res.redirect('/login')
    
    try{
        const decoded=jwt.verify(token,JWT_SECRET);
        req.user=decoded;
        next();
    }catch(err){
        return res.redirect('/login');
    }
}
module.exports=requireJWT;