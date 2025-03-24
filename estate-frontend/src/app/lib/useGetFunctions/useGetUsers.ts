import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../queryFunctions/getUsers";

export const useGetUsers = () => {
    const query = useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
    });
    return query
}
