
import jwt from 'jsonwebtoken';
import * as redis from 'redis';
const secret = process.env.SECRET;
const redisClient = redis.createClient(process.env.REDIS_PORT as any);
redisClient.connect();

export  = {
    sign: (user_id: number) => {
        const payload = {
            id: user_id,
           
        };
        if (typeof secret == "string") {
            return jwt.sign(payload, secret, {
                algorithm: 'HS256',
                expiresIn: '1m',
            });
        }
    },
    decode: (token: string) => {
        let decoded: any;

        decoded = jwt.decode(token);

        return {
            message: true,
            id: decoded.id
        }

    },
    verify: (token: string) => {
        let decoded: any;
        try {
            if (typeof secret == 'string') {
                decoded = jwt.verify(token, secret);
                return {
                    message: true,
                    id: decoded.id,
                };
            }

        } catch (err) {
            return {
                state: false,
            };
        }
    },


    refresh: () => {
        if (typeof secret == 'string') {
            return jwt.sign({}, secret, {
                algorithm: 'HS256',
                expiresIn: '2m',
            });
        }
    },
    refreshVerify: async (token: string, userId: number) => {
        console.log(userId);
        console.log(token);
        try {
            const data = await redisClient.get(String(userId));
            if (typeof data == 'string') {
                console.log(data.split('Bearer ')[1]);
                if (token === data.split('Bearer ')[1]) {
                    try {
                        if (typeof secret == 'string') {
                            jwt.verify(data.split('Bearer ')[1], secret);
                            return { state: true };
                        }

                    } catch (error) {
                        return { state: false };
                    }
                } else {
                    return { state: false };
                }
            }
        } catch (err) {
            return { state: false };
        }
    }
}


