import { useQuery } from "@tanstack/react-query";

import {client} from "@/lib/hono"


export const userGetCategories = ()=>{
    const query = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await client.api.categories.$get()
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