export interface Note {
    key?:string,
    title:string,
    description?:string,
    date:string,
    photo?:string,
    position?:{
        latitude:number,
        longitude:number
    }
}