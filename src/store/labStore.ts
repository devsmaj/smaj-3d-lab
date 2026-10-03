import { create } from 'zustand'
export type ComponentId = 'processor' | null
type LabState = { selectedComponent: ComponentId; selectComponent: (component: ComponentId) => void }
export const useLabStore = create<LabState>((set) => ({ selectedComponent: null, selectComponent: (selectedComponent) => set({ selectedComponent }) }))
