import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

import {toast} from "sonner"
import { InferRequestType, InferResponseType } from "hono";
import { useNewAccount } from "../hooks/use-new-account";


type ResponseType = InferResponseType<typeof client.api.accounts["bulk-delete"]["$post"]>

type RequestType = InferRequestType<typeof client.api.accounts["bulk-delete"]["$post"]>["json"]



export const useBulkDeleteAccounts = ()=>{

    const queryClient = useQueryClient()
    const newAccount = useNewAccount()

    const mutation = useMutation<
    ResponseType,
    Error,
    RequestType> (
        {
            mutationFn : async (json)=>{
                console.log(json)
                const response = await client.api.accounts["bulk-delete"]["$post"]({json})
            
                return await response.json()
            },
            onSuccess: async () => {
                toast.success("Accounts Deleted")
                newAccount.onClose
                queryClient.invalidateQueries({ queryKey: ['accounts'] })
              
              },
              onError: (error) => {
                toast.error("Failed to Delete Accounts")
               
              },
        }
    )
    return mutation 
}

