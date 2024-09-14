import { toast } from "sonner"
import {  InferResponseType } from "hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"
            
import { client } from "@/lib/hono"

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$delete"]>


export const useDeleteTransaction = (id?: string) => {

    console.log(id,"id from query")
    const queryClient = useQueryClient()

    const mutation = useMutation<
        ResponseType,
        Error
    
    >({
        mutationFn: async () => {
            const response = await client.api.transactions[":id"]["$delete"]({ 
                param: { id },
            
            })
            return await response.json()
        },
        onSuccess: () => {
            toast.success("Category Deleted")
            queryClient.invalidateQueries({ queryKey:  ["transaction", { id }] })
            queryClient.invalidateQueries({ queryKey:  ["transactions"] })
            //TODO: Invalidate sumary and transactions
        },
        onError: () => {
            toast.error("Failed to Delete Transaction")
        },
    })

    return mutation
}