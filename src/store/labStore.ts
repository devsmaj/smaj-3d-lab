import { create } from 'zustand'
import type { ComponentId } from '../data/components'
type LabState={selectedComponent:ComponentId;visited:ComponentId[];selectComponent:(component:ComponentId)=>void}
export const useLabStore=create<LabState>((set)=>({selectedComponent:'motherboard',visited:['motherboard'],selectComponent:(selectedComponent)=>set(state=>({selectedComponent,visited:state.visited.includes(selectedComponent)?state.visited:[...state.visited,selectedComponent]}))}))
