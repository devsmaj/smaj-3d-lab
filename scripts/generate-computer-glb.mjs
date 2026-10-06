import { mkdirSync, writeFileSync } from 'node:fs'
import { BoxGeometry, Color, CylinderGeometry, Group, Mesh, MeshStandardMaterial, TorusGeometry } from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

class NodeFileReader {
  result = null
  onloadend = null
  async readAsArrayBuffer(blob) { this.result = await blob.arrayBuffer(); this.onloadend?.() }
  async readAsDataURL(blob) { const bytes = Buffer.from(await blob.arrayBuffer()); this.result = `data:${blob.type};base64,${bytes.toString('base64')}`; this.onloadend?.() }
}
globalThis.FileReader = NodeFileReader

const root = new Group()
root.name = 'SMAJ_COMPUTER_SYSTEM'
const palette = { MOTHERBOARD:0x087b76, CPU:0x00d8ff, RAM:0x8e5cff, GPU:0x008cff, SSD:0xff4fd8, COOLING:0x65f6ff }
const offsets = { MOTHERBOARD:[0,-1.4,0], CPU:[0,2.5,-.3], RAM:[-2.5,1.8,0], GPU:[2.7,2.1,1.2], SSD:[-2.4,1.4,1.8], COOLING:[.2,4,-.2] }
const material = component => new MeshStandardMaterial({color:new Color(palette[component]),metalness:.45,roughness:.32})
function add(name,component,geometry,position,rotation=[0,0,0],explode=offsets[component]){const mesh=new Mesh(geometry,material(component));mesh.name=`${component}__${name}`;mesh.position.set(...position);mesh.rotation.set(...rotation);mesh.userData={component,explode};root.add(mesh);return mesh}
const box=(name,c,size,pos,explode)=>add(name,c,new BoxGeometry(...size),pos,[0,0,0],explode)
box('PCB','MOTHERBOARD',[7,.18,5],[0,0,0])
box('CPU_SOCKET','CPU',[1.65,.16,1.65],[.35,.2,-.35])
box('CPU_DIE','CPU',[1.3,.18,1.3],[.35,.38,-.35])
box('HEAT_SPREADER','CPU',[1.48,.1,1.48],[.35,.53,-.35])
add('HEATSINK','COOLING',new CylinderGeometry(.88,.88,.5,48),[.35,.86,-.35])
add('FAN_RING','COOLING',new TorusGeometry(.67,.08,12,48),[.35,1.16,-.35],[Math.PI/2,0,0])
add('FAN_HUB','COOLING',new CylinderGeometry(.2,.2,.16,32),[.35,1.18,-.35])
for(let i=0;i<7;i++){const blade=box(`FAN_BLADE_${i+1}`,'COOLING',[.14,.07,.58],[.35,1.22,-.35]);blade.rotation.y=i*Math.PI*2/7}
for(let i=0;i<4;i++)box(`DIMM_${i+1}`,'RAM',[.14,.72,3.15],[-1.75+i*.34,.45,-.15],[-2.2,1.3,(i-1.5)*.35])
box('GPU_BOARD','GPU',[3.7,.18,1.25],[1.15,.34,1.28],[2.8,1.9,1.5])
box('GPU_SHROUD','GPU',[3.35,.32,1.05],[1.15,.58,1.28],[2.8,2.3,1.5])
for(let i=0;i<2;i++){add(`GPU_FAN_${i+1}`,'GPU',new CylinderGeometry(.38,.38,.12,32),[.35+i*1.55,.81,1.28],[0,0,Math.PI/2],[2.8,2.8,1.5])}
box('SSD_BODY','SSD',[1.65,.24,1.15],[-2.45,.27,1.55],[-2.8,1.7,1.8])
box('SSD_CONTROLLER','SSD',[.48,.16,.42],[-2.68,.49,1.55],[-3.1,2.1,1.9])
box('SSD_FLASH','SSD',[.58,.16,.72],[-2.12,.49,1.55],[-2.5,2.3,2.1])
for(let i=0;i<3;i++)box(`PCIE_SLOT_${i+1}`,'MOTHERBOARD',[2.7,.18,.16],[.7,.22,.38+i*.38],[0,-.7-i*.25,.2+i*.2])
box('CHIPSET','MOTHERBOARD',[.75,.28,.75],[2.45,.28,-1.25],[1.3,.8,-1.3])
box('POWER_24PIN','MOTHERBOARD',[.28,.42,1.35],[-3.05,.32,.35],[-1.3,.7,.2])
for(let i=0;i<6;i++)box(`IO_PORT_${i+1}`,'MOTHERBOARD',[.42,.44,.38],[-2.7+i*.48,.32,-2.26],[(i-2.5)*.3,.9,-.8])
for(let i=0;i<10;i++)box(`CAPACITOR_${i+1}`,'MOTHERBOARD',[.12,.28,.12],[1.7+(i%5)*.25,.22,-.65+Math.floor(i/5)*.3],[.4+(i%5)*.15,.8,-.4])

mkdirSync('public/models',{recursive:true})
const exporter = new GLTFExporter()
const binary = await new Promise((resolve,reject)=>exporter.parse(root,resolve,reject,{binary:true,trs:true,onlyVisible:true}))
writeFileSync('public/models/computer-system.glb',Buffer.from(binary))
console.log(`Generated public/models/computer-system.glb (${binary.byteLength} bytes, ${root.children.length} separate meshes)`)