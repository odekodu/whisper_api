import { createReadStream, createWriteStream, mkdirSync, rename, rmSync, unlink } from "fs";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from 'multer';
import { v4 as uuidV4 } from 'uuid';
import { testCheck } from "./test.check";

export class Storage {  
  
  static get path(){
    return testCheck()
    ? "test_public"
    : "public";
  }

  join(...path: string[]){
    return [Storage.path, ...path].join('/');
  }

  move(source: string, destination: string, name: string): Promise<string> {
    const path = this.join(destination, name);

    return new Promise((resolve, reject) => {
        mkdirSync(this.join(destination), { recursive: true });

        rename(source, path, (error) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    this.cut(source, destination, name)
                        .then(resolve)
                        .catch(reject)
                }
                else reject(error);
            }

            resolve(path);
        });
    });
  }

  copy(source: string, destination: string) {
    const readStream = createReadStream(source);
    const writeStream = createWriteStream(this.join(destination));
  
    return new Promise((resolve, reject) => {
        readStream.on('error', reject);
        writeStream.on('error', reject);
  
        readStream.on('close', resolve);
        readStream.pipe(writeStream);
    });
  }

  cut(source: string, destination: string, name: string): Promise<string> {
    const path = this.join(destination, name);
    mkdirSync(this.join(destination), { recursive: true });
  
    const readStream = createReadStream(source);
    const writeStream = createWriteStream(path);
  
    return new Promise((resolve, reject) => {
        readStream.on('error', reject);
        writeStream.on('error', reject);
  
        readStream.on('close', () => unlink(source, () => resolve(path)));
        readStream.pipe(writeStream);
    });
  }

  static reset (){    
    rmSync(Storage.path, { recursive: true });
  }

  static upload(
    name: string,
    nFiles: number,
  ) {            
    const store = {
        storage: diskStorage({
            destination: Storage.destination,
            filename: Storage.filename
        })
    } as MulterOptions;
    
    if (nFiles > 1) {        
        return FilesInterceptor(name, nFiles, store);
    }
    else {              
        return FileInterceptor(name, store);
    }
  }

  static get temp(){
    return `${Storage.path}/temp`;
  }

  static destination = (req: any, file: any, cb: any) => {                        
    mkdirSync(Storage.temp, { recursive: true });
    cb(null, Storage.temp);
  }

  static filename = (req: any, file: any, cb: any) => {    
    const filename: string = `${uuidV4()}-${uuidV4()}`
    const extention: string = file.originalname.slice(file.originalname.lastIndexOf('.'));    
    cb(null, `${filename}${extention}`);
  }
}