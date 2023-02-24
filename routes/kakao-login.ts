
import express from 'express';
const router = express. Router();
import  {DATA_SOURCES} from '../config/db';
import mysql from 'mysql2/promise';
import request from 'request-promise';


/**
 * access-token으로 카카오 정보를 가져오고 회원가입 후 jwt access, refresh token 가져오기 
 */
router.post('/', async (req, res, next) => {    
    const connection = await mysql.createConnection(DATA_SOURCES.development); 
    await connection.connect();         
    try {      
        const token = req.headers.authorization;
        if(typeof token == 'string'){
            const kakao_access_token = token.split('Bearer ')[1];




        }
        else{
            return res.status(403).json({
                "code":403,
                "message": "옳바르지 않는 형태입니다."
                });
        }
        





    } catch (error) {
        return res.status(500).json({
        "code":500,
        "message": "server error"
        });
    }finally{
       connection.end();  
    }

});



module.exports = router;