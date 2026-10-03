import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ComponentId } from '../data/components'
type QuizResults=Partial<Record<ComponentId,boolean>>
type LabState={selectedComponent:ComponentId;visited:ComponentId[];quizResults:QuizResults;selectComponent:(component:ComponentId)=>void;recordQuiz:(component:ComponentId,correct:boolean)=>void;mergeProgress:(visited:ComponentId[],quizResults:QuizResults)=>void}
export const useLabStore=create<LabState>()(persist((set)=>({selectedComponent:'motherboard',visited:['motherboard'],quizResults:{},selectComponent:(selectedComponent)=>set(state=>({selectedComponent,visited:state.visited.includes(selectedComponent)?state.visited:[...state.visited,selectedComponent]})),recordQuiz:(component,correct)=>set(state=>({quizResults:{...state.quizResults,[component]:correct||state.quizResults[component]===true}})),mergeProgress:(visited,quizResults)=>set(state=>({visited:[...new Set([...state.visited,...visited])],quizResults:{...state.quizResults,...quizResults}}))}),{name:'smaj-3d-lab-progress',partialize:state=>({selectedComponent:state.selectedComponent,visited:state.visited,quizResults:state.quizResults})}))
