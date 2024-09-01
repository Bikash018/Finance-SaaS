import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

import {toast} from "sonner"
import { InferRequestType, InferResponseType } from "hono";



type ResponseType = InferResponseType<typeof client.api.categories["bulk-delete"]["$post"]>

type RequestType = InferRequestType<typeof client.api.categories["bulk-delete"]["$post"]>["json"]



export const useBulkDeleteCategories = ()=>{

    const queryClient = useQueryClient()


    const mutation = useMutation<
    ResponseType,
    Error,
    RequestType> (
        {
            mutationFn : async (json)=>{
                console.log(json)
                const response = await client.api.categories["bulk-delete"]["$post"]({json})
            
                return await response.json()
            },
            onSuccess: async () => {
                toast.success("Categories Deleted")
             
                queryClient.invalidateQueries({ queryKey: ['categories'] })
              
              },
              onError: (error) => {
                toast.error("Failed to Delete Categories")
               
              },
        }
    )
    return mutation 
}

