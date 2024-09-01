import {create} from "zustand"


type newCategoryState = {
    isOpen : boolean,
    onClose : ()=> void,
    onOpen : () => void
}

export const useNewCategory = create<newCategoryState>((set)=> ({
    isOpen : false,
    onOpen : ()=>set({isOpen : true}),
    onClose : ()=> set({isOpen : false})
}))