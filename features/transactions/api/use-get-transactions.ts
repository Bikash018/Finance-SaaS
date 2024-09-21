import { useQuery } from "@tanstack/react-query";

import {client} from "@/lib/hono"
import { useSearchParams } from "next/navigation";


export const useGetTransactions = ()=>{

    const params = useSearchParams()
    const from = params.get('from') || '';
    const to = params.get('to') || '';
    const accountId = params.get('accountId') || '';
    const query = useQuery({
        queryKey: ['transactions', { from, to, accountId }],
        queryFn: async () => {
            const response = await client.api.transactions.$get({ query: { from, to, accountId } });
            console.log("transaction api called")
            if(!response.ok){
                throw new Error("Failed to fetch Response")
            }

            const {data} = await response.json()
            console.log(data,"data fetched succefully")
            return data

        }
    })
    return query;
}