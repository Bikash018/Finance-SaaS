import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

import {toast} from "sonner"
import { InferRequestType, InferResponseType } from "hono";


type ResponseType = InferResponseType<typeof client.api.accounts.$post>

type RequestType =  any

export const useCreateAccount = ()=>{
    const queryClient = useQueryClient()

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
                queryClient.invalidateQueries({ queryKey: ['accounts'] })
              },
            //   onError: (error) => {
            //     toast.error("Failed to Create Account")
            //     console.log(error,"error broke")
            //   },
        }
    )
    return mutation 
}

