import { toast } from "sonner"
import { InferRequestType, InferResponseType } from "hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"
            
import { client } from "@/lib/hono"

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.transactions[":id"]["$patch"]>["json"];

export const useEditTransactions    = (id?: string) => {
    const queryClient = useQueryClient()

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.transactions[":id"]["$patch"]({ 
                param: { id },
                json, 
            })
            return await response.json()
        },
        onSuccess: () => {
            toast.success("Transactions updated")
            queryClient.invalidateQueries({ queryKey:  ["transaction", { id }] })
            queryClient.invalidateQueries({ queryKey:  ["transactions"] })
            //TODO: Invalidate sumary and transactions
        },
        onError: () => {
            toast.error("Failed to edit Transactions")
        },
    })

    return mutation
}