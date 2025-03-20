import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Backend_URL } from "../Constants";
import getAccessSession from "../getAccessToken";

export const useCreateHousePropertyWithOffer = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async ({ form }: any) => {
            const session = await getAccessSession();
            const response = await fetch(Backend_URL + "/house-properties/create-with-offer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session}`,
                },
                body: JSON.stringify(form),

            })
            if (!response.ok) {
                throw new Error('Failed to create house property');
            }

            return await response.json();
        },
        async onSuccess(data, variables, context) {
            toast.success('House property created')
            const newPost = await data
            console.log(newPost)
            queryClient.invalidateQueries({ queryKey: ['houseProperty'] })
        },
        onError: () => {
            toast.error('Failed to create project')
        }
    });

    return mutation;
}

