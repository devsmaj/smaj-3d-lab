import { readdirSync,statSync } from 'node:fs'
const files=readdirSync('dist/assets').filter(file=>file.endsWith('.js'));const bytes=files.reduce((total,file)=>total+statSync(`dist/assets/${file}`).size,0);const limit=3*1024*1024;console.log(`JavaScript bundle: ${(bytes/1024/1024).toFixed(2)} MB / 3.00 MB budget`);if(bytes>limit){console.error('Bundle budget exceeded');process.exit(1)}
