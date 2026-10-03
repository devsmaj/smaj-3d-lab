import { mkdirSync, writeFileSync } from 'node:fs'

const positions=[-1,-1,1,1,-1,1,1,1,1,-1,1,1,1,-1,-1,-1,-1,-1,-1,1,-1,1,1,-1]
const normals=[0,0,1,0,0,1,0,0,1,0,0,1,0,0,-1,0,0,-1,0,0,-1,0,0,-1]
const indices=[0,1,2,0,2,3,4,5,6,4,6,7,3,2,6,3,6,5,4,7,1,4,1,0,1,7,6,1,6,2,4,0,3,4,3,5]
const chunks=[]
const add=(array,Type)=>{const data=new Type(array);const b=Buffer.from(data.buffer);const offset=chunks.reduce((n,c)=>n+c.length,0);chunks.push(b);return {offset,length:b.length}}
const p=add(positions,Float32Array),n=add(normals,Float32Array),i=add(indices,Uint16Array)
const buffer=Buffer.concat(chunks)
const materials=[['Board',[0.04,0.22,0.15,1]],['CPU',[0.72,0.75,0.6,1]],['Slots',[0.05,0.08,0.07,1]],['Metal',[0.32,0.38,0.35,1]]]
const nodes=[
 ['Motherboard',[0,-.18,0],[2.7,.14,1.8],0],['CPU',[.45,.16,.1],[.75,.17,.75],1],
 ['RAM_A',[-1.75,.18,.35],[.14,.2,1.05],2],['RAM_B',[-1.1,.18,.35],[.14,.2,1.05],2],
 ['Chipset',[1.78,.16,.8],[.45,.19,.35],3],
 ...[-1.8,-1.2,-.6,0,.6,1.2,1.8].map((x,k)=>['PCIE_'+k,[x,.02,-1.18],[.15,.11,.675],2])
]
const gltf={asset:{version:'2.0',generator:'SMAJ 3D Lab'},scene:0,scenes:[{nodes:nodes.map((_,k)=>k)}],nodes:nodes.map(([name,translation,scale,material])=>({name,mesh:material,translation,scale})),meshes:materials.map(([name],material)=>({name,primitives:[{attributes:{POSITION:0,NORMAL:1},indices:2,material}]})),materials:materials.map(([name,color])=>({name,pbrMetallicRoughness:{baseColorFactor:color,metallicFactor:name==='Board'?.12:.55,roughnessFactor:name==='Board'?.72:.35}})),buffers:[{byteLength:buffer.length,uri:'data:application/octet-stream;base64,'+buffer.toString('base64')}],bufferViews:[{buffer:0,byteOffset:p.offset,byteLength:p.length,target:34962},{buffer:0,byteOffset:n.offset,byteLength:n.length,target:34962},{buffer:0,byteOffset:i.offset,byteLength:i.length,target:34963}],accessors:[{bufferView:0,componentType:5126,count:8,type:'VEC3',min:[-1,-1,-1],max:[1,1,1]},{bufferView:1,componentType:5126,count:8,type:'VEC3'},{bufferView:2,componentType:5123,count:36,type:'SCALAR'}]}
mkdirSync('public/models',{recursive:true})
writeFileSync('public/models/motherboard.gltf',JSON.stringify(gltf))
