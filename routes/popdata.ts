

import express from 'express';
const router = express. Router();
import  {DATA_SOURCES} from '../config/db';
import mysql from 'mysql2/promise';



router.get('/', async (req, res, next) => {    
    const connection = await mysql.createConnection(DATA_SOURCES.development); // DB 커넥션 생성
    await connection.connect();         
    
    try {      
        const pop_up_store_data : string = `select * from storedata; `
        const result = await connection.query(pop_up_store_data);
        
        const result2 = result[0];
        console.log(result[0]);
        if(result !== null || undefined){
            return res.status(203).json({
                result2,
                code: 203,
                message: "Ok"
            });
        }
        return res.status(404).json({
            code: 404,
            message: "not data"
        });
        
    } catch (error) {
        res.status(500).json({
        "code":500,
        "message": "server error"
        });
    }finally{
       connection.end();  
    }

});



module.exports = router;