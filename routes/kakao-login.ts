
import express from 'express';
const router = express.Router();
import { DATA_SOURCES } from '../config/db';
import mysql from 'mysql2/promise';
import axios from 'axios';
import * as redis from 'redis';
import jwt from '../jwt-token/jwt-make'
const redisClient = redis.createClient(process.env.REDIS_PORT as any);
redisClient.connect();
/**
 * access-token으로 카카오 정보를 가져오고 회원가입 후 jwt access, refresh token 가져오기 
 */
router.post('/login', async (req, res, next) => {
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
            console.log(user_email, user_id);
            const user_sign = `select * from users where email = '${String(user_email)}'; `
            const user_sign_result = await connection.query(user_sign);
            console.log(user_sign_result[0]);
            if (user_sign_result[0] == null || user_sign_result[0] == undefined ||
                (user_sign_result[0] != null && typeof user_sign_result[0] == "object" && !Object.keys(user_sign_result[0]).length)) {
                const pop_up_store_data: string = `insert into users(email, password) values("${user_email}","${user_id}"); `
                await connection.query(pop_up_store_data);

            }
            const user_index_id = `select id from users where email = '${String(user_email)}'; `
            const user_sign_id_exe: any = await connection.query(user_index_id);
            console.log(user_sign_id_exe[0][0].id);



            const accessToken = "Bearer " + jwt.sign(user_sign_id_exe[0][0].id);
            const refreshToken = "Bearer " + jwt.refresh();
            console.log(user_sign_id_exe[0][0].id);
            redisClient.set(String(user_sign_id_exe[0][0].id), refreshToken);

            res.status(200).json({
                state: true,
                data: {
                    accessToken,
                    refreshToken,
                }
            });
        }
        else {
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


router.post('/logout', async (req, res, next) => {

    try {
        if (typeof req.headers.authorization == "string") {
            const token = req.headers.authorization.split('Bearer ')[1];
            const decode : {id:string} = jwt.decode(token);
            if (decode === null) {
                res.status(404).send({
                    code: 404,
                    state: false,
                    message: 'No content.',
                });
            }
            console.log(decode.id);
            await redisClient.del(String(decode.id));
            return res.status(200).send({
                code: 200,
                message: "Ok"
            });
        }
        else {
            return res.status(403).json({
                "code": 403,
                "message": "옳바르지 않는 형태입니다."
            });
        }
    } catch (error) {
        return res.status(401).json('Unauthorized access');
    }
});
module.exports = router;