import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
export const signup = async (req,res) =>{
    const {username, email, password} = req.body;
    try {
        if(!username | !email | !password){
            res.status(400).json({err:"enter all the fields"})
        }
        let hashedPassword = bcrypt.hashSync(password,10)
        
        let user = await User.create({username,email,password:hashedPassword})
        if(!user){
            res.status(404).json({err:"user not created"})
        }
        res.status(201).json({user:"user created successfully"})
        
    } catch (error) {
        return res.status(500).json(error.message)
    }
}