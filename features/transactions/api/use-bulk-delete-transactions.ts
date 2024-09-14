import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

import {toast} from "sonner"
import { InferRequestType, InferResponseType } from "hono";



type ResponseType = InferResponseType<typeof client.api.transactions["bulk-delete"]["$post"]>

type RequestType = InferRequestType<typeof client.api.transactions["bulk-delete"]["$post"]>["json"]



export const useBulkDeleteCategories = ()=>{

    const queryClient = useQueryClient()


    const mutation = useMutation<
    ResponseType,
    Error,
    RequestType> (
        {
            mutationFn : async (json)=>{
                console.log(json)
                const response = await client.api.transactions["bulk-delete"]["$post"]({json})
            
                return await response.json()
            },
            onSuccess: async () => {
                toast.success("Categories Deleted")
             
                queryClient.invalidateQueries({ queryKey: ['transactions'] })
              
              },
              onError: (error) => {
                toast.error("Failed to Delete Transactions")
               
              },
        }
    )
    return mutation 
}

