import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Backend_URL } from "../Constants";
import getAccessSession from "../getAccessToken";

export const useDeleteOffer = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async ({ id, housePropertyId, tradeType }: any) => {
            console.log('id is coming: ', id)
            const session = await getAccessSession();
            const response = await fetch(Backend_URL + `/offers/${id}`, {
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
            toast.success('offer deleted')
            // queryClient.invalidateQueries({ queryKey: ['offer'] })
        },
        onError: () => {
            toast.error('Failed to delete property')
        }
    });

    return mutation;
}

