import { useQuery } from "@tanstack/react-query";
import { getInvitations } from "../queryFunctions/getInvitations";


export const useGetInvitations = () => {
    const query = useQuery({
        queryKey: ["invitations"],
        queryFn: getInvitations,
    });
    return query
}
