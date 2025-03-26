import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Backend_URL } from "../Constants";
import getAccessSession from "../getAccessToken";

export const useCreateDeal = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async ({ form }: any) => {
            const session = await getAccessSession();
            const response = await fetch(Backend_URL + "/deals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session}`,
                },
                body: JSON.stringify(form),

            })
            if (!response.ok) {
                throw new Error('Failed to create offer');
            }

            return await response.json();
        },
        async onSuccess(data, variables, context) {
            toast.success('Deal created')
            queryClient.invalidateQueries({ queryKey: ['deal'] })
        },
        onError: () => {
            toast.error('Failed to create deal')
        }
    });

    return mutation;
}