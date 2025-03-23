import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Backend_URL } from "../Constants";
import getAccessSession from "../getAccessToken";

export const useUpdateHouseProperty = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async ({ json, id }: any) => {
            console.log('id is coming: ', id, json)
            const session = await getAccessSession();
            const response = await fetch(Backend_URL + `/house-properties/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session}`,
                },
                body: JSON.stringify(json),

            })
            if (!response.ok) {
                throw new Error('Failed to update house property');
            }
            return await response.json();
        },
        async onSuccess(data, variables, context) {
            toast.success('House property updated')
            const newPost = data
            console.log(newPost)
            //queryClient.invalidateQueries({ queryKey: ['houseProperty'] })
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update property')
        }
    });

    return mutation;
}

