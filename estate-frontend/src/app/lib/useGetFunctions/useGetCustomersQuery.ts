import { useQuery } from "@tanstack/react-query";
import { getAgenciesQuery } from "../queryFunctions/getAgenciesQuery";
import { getCustomersQuery } from "../queryFunctions/getCustomersQuery";

interface UseGetCustomersProps {
    name?: string | null;
    phoneNumber?: string | null;
    intro?: string | null;

}

export const useGetCustomersQuery = ({ name, phoneNumber, intro }: UseGetCustomersProps) => {
    console.log('yo- customer')
    const query = useQuery({
        queryKey: ["customer", { name, phoneNumber, intro }],
        queryFn: getCustomersQuery,

    });
    return query
}
