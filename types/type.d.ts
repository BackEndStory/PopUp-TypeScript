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

  }
  //declare module 'my-module';
  export {}