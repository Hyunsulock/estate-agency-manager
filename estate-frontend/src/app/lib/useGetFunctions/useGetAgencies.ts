import { useQuery } from "@tanstack/react-query";
import { getAgencies } from "../queryFunctions/getAgencies";


export const useGetAgencies = () => {
    console.log('yo- agency')
    const query = useQuery({
        queryKey: ["agency"],
        queryFn: getAgencies,
    });

    return query
}
