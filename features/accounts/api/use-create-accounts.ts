import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

import {toast} from "sonner"
import { InferRequestType, InferResponseType } from "hono";
import { useNewAccount } from "../hooks/use-new-account";


type ResponseType = InferResponseType<typeof client.api.accounts.$post>

type RequestType =  any



export const useCreateAccount = ()=>{
    const { isOpen , onClose } = useNewAccount()
    const queryClient = useQueryClient()
    const newAccount = useNewAccount()

    const mutation = useMutation<
    ResponseType,
    Error,
    RequestType> (
        {
            mutationFn : async (json)=>{
                console.log(json)
                const response = await client.api.accounts.$post({json})
                console.log(response,"responseee")
                return await response.json()
            },
            onSuccess: async () => {
                toast.success("Account Created")
                newAccount.onClose
                queryClient.invalidateQueries({ queryKey: ['accounts'] })
              
              },
              onError: (error) => {
                toast.error("Failed to Create Account")
               
              },
        }
    )
    return mutation 
}

