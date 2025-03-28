import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Backend_URL } from "../Constants";
import getAccessSession from "../getAccessToken";

export const useCreateAgencyAdmin = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async ({ form }: any) => {
            const session = await getAccessSession();
            const response = await fetch(Backend_URL + "/agencies/admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session}`,
                },
                body: JSON.stringify(form),

            })
            if (!response.ok) {
                console.log(response.statusText)
                throw new Error('Failed to create agency');
            }

            return await response.json();
        },
        async onSuccess(data, variables, context) {
            toast.success('Agency created')
            queryClient.invalidateQueries({ queryKey: ['agencies'] })
        },
        onError: () => {
            toast.error('Failed to create agency')
        }
    });

    return mutation;
}