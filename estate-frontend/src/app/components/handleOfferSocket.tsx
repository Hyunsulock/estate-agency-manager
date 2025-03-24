import { QueryClient } from "@tanstack/react-query";
import { getRelevantQueries } from "../lib/getRelevantQueries";

const flattenHousePropertyData = (property: any) => ({
    id: property.id,
    size: property.size,
    room: property.room,
    status: property.status,
    buildingnumber: property.buildingNumber,
    floor: property.floor,
    unitnumber: property.unitNumber,
});

export const handleOfferSocket = (
    queryClient: QueryClient,
    message: any,
    currentUserId: string | undefined | number
) => {
    //if (message.updatedBy == currentUserId) return;

    queryClient.invalidateQueries({
        queryKey: ["offer"],
    });

    const relevantQueries = getRelevantQueries(queryClient, "houseProperty");

    relevantQueries.forEach((query) => {
        const oldData = queryClient.getQueryData(query.queryKey);

        if (!oldData) {
            return;
        }
        queryClient.setQueryData(query.queryKey, (oldData: any) => {
            if (!oldData) {
                return oldData;
            }
            if (
                message.type === "update" ||
                message.type === "create" ||
                message.type === "delete"
            ) {
                if (Array.isArray(oldData)) {
                    const flattenedUpdate = flattenHousePropertyData(
                        message.data.houseProperty
                    );

                    const exists = oldData.some(
                        (item: any) => item.id === flattenedUpdate.id
                    );

                    if (exists) {
                        queryClient.invalidateQueries({
                            queryKey: query.queryKey,
                        });
                        return;
                    }

                    return oldData;
                }
            }

            return oldData;
        });
    });
};
