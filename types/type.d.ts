declare global {

  interface Error {
    code?: number;
    status?: number;
    message? : string;
  }
  namespace Express {
    export interface Request {
      message: 'OK'
    }
  }

  type Config = {
    username: string,
    password: string,
    database: string,
    host: string,
    port: number,

  }

  interface IConfig {
    development: Config;
  }

  interface Decode{
    id?: number;
    role? : number;
  }



}


//declare module 'my-module';
export { }