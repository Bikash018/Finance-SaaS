import {create} from "zustand"


type newTransactionsState = {
    isOpen : boolean,
    onClose : ()=> void,
    onOpen : () => void
}

export const useNewTransactions = create<newTransactionsState>((set)=> ({
    isOpen : false,
    onOpen : ()=>set({isOpen : true}),
    onClose : ()=> set({isOpen : false})
}))