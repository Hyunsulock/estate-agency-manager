import { useQuery } from "@tanstack/react-query";
import { getApartmentsQuery } from "../queryFunctions/getApartmentsQuery";

interface UseGetApartmentsProps {
    name?: string | null;
    address?: string | null;


}

export const useGetApartmentsQuery = ({ name, address }: UseGetApartmentsProps) => {
    const query = useQuery({
        queryKey: ["apartment", { name, address }],
        queryFn: getApartmentsQuery,
    });
    return query
}

