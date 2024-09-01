import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

import {toast} from "sonner"
import { InferRequestType, InferResponseType } from "hono";



type ResponseType = InferResponseType<typeof client.api.categories.$post>

type RequestType =  any



export const useCreateCategory = ()=>{
 
    const queryClient = useQueryClient()
    

    const mutation = useMutation<
    ResponseType,
    Error,
    RequestType> (
        {
            mutationFn : async (json)=>{
                console.log(json)
                const response = await client.api.categories.$post({json})
                console.log(response,"responseee")
                return await response.json()
            },
            onSuccess: async () => {
                toast.success("Category Created")
     
                queryClient.invalidateQueries({ queryKey: ['categories'] })
              
              },
              onError: (error) => {
                toast.error("Failed to Create Category")
               
              },
        }
    )
    return mutation 
}

