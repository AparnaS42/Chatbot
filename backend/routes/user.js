import express from 'express'
import bcryt from 'bcrypt'
const router = express.Router()
import {User} from '../models/User.js'
import jwt from 'jsonwebtoken'

router.post('/signup' , async (req , res) => {
    const { username , email , password } = req.boby;
    const user = User.find({email})
    if(user) {
        return res.json({message: "user already existed"})
    }
    const hashpass = await bcryt.hash(password , 10)
    const newUser = new User({
        username,
        email,
        password: hashpass
    })
    await newUser.save()
    return res.json({message: "record registed"})
})
router.post('/login' , async(req , res) => {
    const {email , password} = req.body;
    const user = await User.findOne({email})
    if(!user){
        return res.json({message: "user is not registered"})
    }
    const validPass = await bcryt.compare(password , user.password);
    if(!validPass){
        return res.json({message: "Incorrect password"});
    }
    const token = jwt.sign({username:user.username} , process.env.KEY , {expiresIn: '1h'});
    res.cookie('token' , token ,  {maxAge: '360000'})
    return res.json({status : true , message : "User Lonin Succesfully"})
})

export {router as UserRouter}