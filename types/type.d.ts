declare global {
    
    interface Error {
        code?: number;
        status?:number;
      } 
    namespace Express {
      export interface Request{
        message:'OK'
      }
    }
   
    type Config = {
      username: string, 
      password: string, 
      database : string, 
      host : string, 
      port: number,
 
    }
    
    interface IConfig {
      development : Config;
    }

}

  
  //declare module 'my-module';
  export {}