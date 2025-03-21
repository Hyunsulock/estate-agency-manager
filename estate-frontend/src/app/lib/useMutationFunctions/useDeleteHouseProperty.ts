import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Backend_URL } from "../Constants";
import getAccessSession from "../getAccessToken";

export const useDeleteHouseProperty = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async ({ id }: any) => {
            console.log('id is coming: ', id)
            const session = await getAccessSession();
            const response = await fetch(Backend_URL + `/house-properties/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session}`,
                },

            })
            if (!response.ok) {
                throw new Error('Failed to delete house property');
            }

            return await response.json();
        },
        async onSuccess(data, variables, context) {
            toast.success('House property deleted')
            const newPost = data
            console.log(newPost)
            queryClient.invalidateQueries({ queryKey: ['houseProperty'] })
        },
        onError: () => {
            toast.error('Failed to delete property')
        }
    });

    return mutation;
}

