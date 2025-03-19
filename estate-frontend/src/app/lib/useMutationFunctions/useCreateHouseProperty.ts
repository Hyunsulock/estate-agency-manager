import { toast} from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Backend_URL } from "../Constants";
import getAccessSession from "../getAccessToken";

export const useCreateHouseProperty = async () => {
    const session = await getAccessSession();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn : ({ json }: any) => {
            return fetch(Backend_URL + "/house-properties", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session}`,
                },
                body: json,

            })
        },
        async onSuccess(data, variables, context) {
            const newPost = await data.json();
            console.log(newPost)
            queryClient.invalidateQueries({queryKey: ['houseProperty']})
        },
        onError: () => {
            toast.error('Failed to create project')
        }
    });

    return mutation;
}

