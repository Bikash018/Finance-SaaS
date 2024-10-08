import {create} from "zustand"


type newAccountState = {
    isOpen : boolean,
    onClose : ()=> void,
    onOpen : () => void
}

export const useNewAccount = create<newAccountState>((set)=> ({
    isOpen : false,
    onOpen : ()=>set({isOpen : true}),
    onClose : ()=> set({isOpen : false})
}))