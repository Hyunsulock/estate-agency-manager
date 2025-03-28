import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Backend_URL } from "../Constants";
import getAccessSession from "../getAccessToken";

export const useDeleteCustomer = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async ({ id }: any) => {
            console.log('id is coming: ', id)
            const session = await getAccessSession();
            const response = await fetch(Backend_URL + `/customers/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session}`,
                },

            })
            if (!response.ok) {
                throw new Error('Failed to delete Customer');
            }

            return await response.json();
        },
        async onSuccess(data, variables, context) {
            toast.success('customer deleted')
            queryClient.invalidateQueries({ queryKey: ['customer'] })
        },
        onError: () => {
            toast.error('Failed to delete customer')
        }
    });

    return mutation;
}

