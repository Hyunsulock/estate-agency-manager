import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Backend_URL } from "../Constants";
import getAccessSession from "../getAccessToken";

export const useCreateOffer = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async ({ form}: any) => {
            const session = await getAccessSession();
            const response = await fetch(Backend_URL + "/offers", {
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
            toast.success('Offer created')
            //queryClient.invalidateQueries({ queryKey: ['houseProperty'] })
        },
        onError: () => {
            toast.error('Failed to create offer')
        }
    });

    return mutation;
}

