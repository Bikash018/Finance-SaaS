import { useQuery } from "@tanstack/react-query";

import {client} from "@/lib/hono"
import { convertAmountFromMiliuinits } from "@/lib/utils";


export const useGetTransaction = ( id? : string)=>{
    const query = useQuery({
        enabled : !!id,
        queryKey: ['transaction', { id }],
        queryFn: async () => {
            const response = await client.api.transactions[":id"].$get({
                param : {id}
            })
            if(!response.ok){
                throw new Error("Failed to fetch Transactions")
            }

            const {data} = await response.json()
            // console.log(data,"data fetched succefully")
            return {
                ...data,
                amount : convertAmountFromMiliuinits(data.amount)
            }

        }
    })
    return query;
}