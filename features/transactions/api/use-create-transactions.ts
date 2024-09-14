import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

import {toast} from "sonner"
import { InferRequestType, InferResponseType } from "hono";



type ResponseType = InferResponseType<typeof client.api.transactions.$post>

type RequestType =  any



export const useCreateTransactions = ()=>{
 
    const queryClient = useQueryClient()
    

    const mutation = useMutation<
    ResponseType,
    Error,
    RequestType> (
        {
            mutationFn : async (json)=>{
                console.log(json)
                const response = await client.api.transactions.$post({json})
                console.log(response,"responseee")
                return await response.json()
            },
            onSuccess: async () => {
                toast.success("Category Created")
     
                queryClient.invalidateQueries({ queryKey: ['transactions'] })
              
              },
              onError: (error) => {
                toast.error("Failed to Create Transactions")
               
              },
        }
    )
    return mutation 
}

