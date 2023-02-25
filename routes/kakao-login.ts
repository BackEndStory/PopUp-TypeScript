
import express from 'express';
const router = express.Router();
import { DATA_SOURCES } from '../config/db';
import mysql from 'mysql2/promise';
import axios from 'axios';


/**
 * access-token으로 카카오 정보를 가져오고 회원가입 후 jwt access, refresh token 가져오기 
 */
router.post('/kakao_login', async (req, res, next) => {
    const connection = await mysql.createConnection(DATA_SOURCES.development);
    await connection.connect();

    try {
        const kakao_access_token = req.headers.authorization;
        // const kakao_access_token2 = kakao_access_token.split('Bearer ')[1];

        if (typeof kakao_access_token == 'string') {

            const user_data = await axios({
                method: 'get',
                url: 'https://kapi.kakao.com/v2/user/me',
                headers: {
                    Authorization: `Bearer ${kakao_access_token}`
                }
            })
            const user_email = user_data.data.kakao_account.email
            const user_id = user_data.data.id
            console.log(user_email,user_id);
            const user_sign = `select * from users where email = '${String(user_email)}'; `
            const user_sign_result = await connection.query(user_sign);
            console.log(user_sign_result[0]);
            if (user_sign_result[0] == null || user_sign_result[0] == undefined || 
            ( user_sign_result[0]!= null && typeof user_sign_result[0] == "object" && !Object.keys(user_sign_result[0]).length)) {
                console.log(1);
                const pop_up_store_data: string = `insert into users(email, password) values("${user_email}","${user_id}"); `
                await connection.query(pop_up_store_data);
            
            }
            console.log(2);
            return res.status(200).json({
                "code": 200,
                "message": "OK"
            });
        }
        else {
            console.log(3);
            return res.status(403).json({
                "code": 403,
                "message": "옳바르지 않는 형태입니다."
            });
        }
    } catch (error) {
        return res.status(500).json({
            "code": 500,
            "message": "server error"
        });
    } finally {
        connection.end();
    }

});



module.exports = router;