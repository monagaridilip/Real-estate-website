import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
export const signup = async (req,res,next) =>{
    const {username, email, password} = req.body;
    
    try {
        if(!username | !email | !password){
            return res.status(400).json({err:"enter all the fields"})
        }
        let user = await User.findOne({email})
        let user2 = await User.findOne({username})
        if(user ){
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