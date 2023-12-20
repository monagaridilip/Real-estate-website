import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
export const signup = async (req,res,next) =>{
    const {username, email, password} = req.body;
    try {
        if(!username | !email | !password){
            return res.status(400).json({err:"enter all the fields"})
        }
        let hashedPassword = bcrypt.hashSync(password,10)
        
        let user = await User.create({username,email,password:hashedPassword})
        if(!user){
            return res.status(404).json({err:"user not created"})
        }
        res.status(201).json({user:"user created successfully"})
        
    } catch (error) {
        next(error);
    }
}