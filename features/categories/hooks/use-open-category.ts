import {create} from "zustand"


type openCategoryState = {
    id? : string
    isOpen : boolean,
    onClose : ()=> void,
    onOpen : (id : string) => void
}

export const useOpenCategory = create<openCategoryState>((set)=> ({
    id : undefined,
    isOpen : false,
    onOpen : (id? : string)=>set({isOpen : true , id}),
    onClose : ()=> set({isOpen : false , id: undefined})
}))