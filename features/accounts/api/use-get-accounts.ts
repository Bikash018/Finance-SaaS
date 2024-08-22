import { useQuery } from "@tanstack/react-query";

import {client} from "@/lib/hono"


export const userGetAccounts = ()=>{
    const query = useQuery({
        queryKey: ['accounts'],
        queryFn: async () => {
            const response = await client.api.accounts.$get()
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