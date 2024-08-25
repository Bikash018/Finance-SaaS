import {create} from "zustand"


type openAccountState = {
    id? : string
    isOpen : boolean,
    onClose : ()=> void,
    onOpen : (id : string) => void
}

export const useOpenAccount = create<openAccountState>((set)=> ({
    id : undefined,
    isOpen : true,
    onOpen : (id? : string)=>set({isOpen : true , id}),
    onClose : ()=> set({isOpen : false , id: undefined})
}))