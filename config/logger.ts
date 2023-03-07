require('dotenv').config();

const S3StreamLogger = require('s3-streamlogger').S3StreamLogger;
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
//import strftime from 'strftime';



//const strftimeKOR = strftime.timezone('+0900');



function s3_stream(level: string) {
    //const time_data = strftimeKOR('%F %T', new Date()); // set Time in Seoul, South Korea
    const time_data = new Date();
    return new S3StreamLogger({
        bucket: `${process.env.BUCKET_NAME}`,
        tags: { type: 'log', version: `${process.env.VERSION}` },
        folder: `${level}`,
        name_format: `${time_data}.log`,
        access_key_id: `${process.env.ACCESS_KEY_ID}`,
        secret_access_key: `${process.env.SECRET_ACCESS_KEY}`,
    });
}

const { combine, timestamp, printf } = winston.format;

const logFormat = printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat,
    ),
    transports: [
        new winstonDaily({
            level: 'info',
            stream: s3_stream('info'),
        }),

        new winstonDaily({
            level: 'error',
            stream: s3_stream('error'),
        }),
    ],
    exceptionHandlers: [
        new winstonDaily({
            level: 'error',
            stream: s3_stream('error'),
        }),
    ],
    exitOnError: false,
});

export class LoggerStream {
    write(message: string) {
        logger.info(message.substring(0, message.lastIndexOf('\n')));
    }
}



export default logger;

