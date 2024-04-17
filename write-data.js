import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const writeData = (file, data) => {
    // write rawText data to file
    try { 
        fs.writeFile(__dirname + file, `export const articleRaw = \n ${data}`, 'utf-8', (err) => {
            if(err) {
                console.log(err);
            }
        })
    } catch(err) {
        console.error(err)    
    }
}

export const isFileWritten = async (file, text) => {
    // read file based on text
    try {
        const fileData = fs.readFile(__dirname + file, 'utf8');
        const targetText = (await fileData).indexOf(text) >= 0
          
        return targetText
    } catch(err) {
        console.log(err)
    }
}