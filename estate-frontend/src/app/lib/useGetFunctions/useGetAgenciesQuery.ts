import { useQuery } from "@tanstack/react-query";
import { getAgenciesQuery } from "../queryFunctions/getAgenciesQuery";

interface UseGetAgenciesProps {
    name?: string | null;
    phoneNumber?: string | null;
    location?: string | null;

}

export const useGetAgenciesQuery = ({ name, phoneNumber, location }: UseGetAgenciesProps) => {
    const query = useQuery({
        queryKey: ["agency", { name, phoneNumber, location }],
        queryFn: getAgenciesQuery,
    });
    return query
}

