
import express from 'express';
const app = express();
import detenv from 'dotenv';
detenv.config();
import morgan from 'morgan';
import  logger,{LoggerStream} from './config/logger';


app.set('port',  process.env.DEV_PORT || 3030);
app.use(express.json());
//app.use(morgan('combined'));
app.use(morgan('combined', { stream: new LoggerStream() }));

app.use('/api', require('./routes/popup-data'));
 
app.use('/kakao', require('./routes/kakao-login'));


app.use((req, res, next) => {
    const error  =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.message = '404';
    next(error);
});




app.listen(process.env.DEV_PORT , () => {  
    console.log(app.get('port'), '번 포트에서 대기 중!');
    logger.info(
        `Server On : http://${process.env.HOST}:${process.env.DEV_PORT}/`,
      );
});
