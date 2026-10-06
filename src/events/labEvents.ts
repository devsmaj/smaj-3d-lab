export type LabEventDetail={type:string;label:string;value?:string}
export const emitLabEvent=(detail:LabEventDetail)=>window.dispatchEvent(new CustomEvent<LabEventDetail>('smaj:lab-event',{detail}))