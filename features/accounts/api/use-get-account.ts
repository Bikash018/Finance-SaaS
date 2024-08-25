import { useQuery } from "@tanstack/react-query";

import {client} from "@/lib/hono"


export const userGetAccount = ( id? : string)=>{
    const query = useQuery({
        enabled : !!id,
        queryKey: ['accounts', { id }],
        queryFn: async () => {
            const response = await client.api.accounts[":id"].$get({
                param : {id}
            })
            if(!response.ok){
                throw new Error("Failed to fetch account")
            }

            const {data} = await response.json()
            // console.log(data,"data fetched succefully")
            return data

        }
    })
    return query;
}