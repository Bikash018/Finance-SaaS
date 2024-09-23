import {create} from "zustand"


type openTransactionState = {
    id? : string
    isOpen : boolean,
    onClose : ()=> void,
    onOpen : (id : string) => void
}

export const useOpenTransaction = create<openTransactionState>((set)=> ({
    id : undefined,
    isOpen : false,
    onOpen : (id? : string)=>set({isOpen : true , id}),
    onClose : ()=> set({isOpen : false , id: undefined})
}))