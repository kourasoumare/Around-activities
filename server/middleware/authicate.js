import { verifyToken } from "../utils/token.js";
const authenticate = async(req,res,next)=>{
    try{
        const autheHeader=req.headers.authorization

        if(!autheHeader || !autheHeader.startsWith("Bearer")){
             return res.status(401).json({
                message:'authentication failed!!!!!'
            })
        }

        const token = autheHeader.split(" ")[1]
        const decodedToken = verifyToken(token)

        req.userId= decodedToken.userId


        next()
    } catch(error){
        res.status(500).json({
            message:'Authentication failed'
        })
    }
}
export default authenticate