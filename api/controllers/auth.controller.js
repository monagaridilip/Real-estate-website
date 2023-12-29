import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {errorHandler} from '../utils/error.js'
export const signup = async (req,res,next) =>{
    const {username, email, password} = req.body;
    
    try {
        if(!username | !email | !password){
            return res.status(400).json({err:"enter all the fields"})
        }
        let user = await User.findOne({email})
        let user2 = await User.findOne({username})
        if(user){
            return res.json({err:`${email} is already exits`})
        }
        if(user2){
            return res.json({err:`${username} is already exits`})
        }
        // console.log(user)
        let hashedPassword = bcrypt.hashSync(password,10)
        
        user = await User.create({username,email,password:hashedPassword})
        // if(!user){
        //     return res.status(404).json({err:"user not created"})
        // }
        res.status(201).json({user:"user created successfully"})
        
    } catch (error) {
        next(error);
    }
}

export const signin = async(req,res,next)=>{
    const {email,password} = req.body;
    const validUser = await User.findOne({email})
    if(!validUser){
        return next(errorHandler(404,'User Not Found'))
    }
    const validPassword = bcrypt.compareSync(password,validUser.password)
    if(!validPassword){
        return next(errorHandler(401,'Invalid credentials'))
    }
    const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET_KEY)
    const {password:pass,...rest} = validUser._doc;
    res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest)
    
}