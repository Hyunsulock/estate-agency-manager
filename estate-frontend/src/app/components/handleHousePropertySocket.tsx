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
    apartmentid: property.apartment?.id ?? null,
    apartmentname: property.apartment?.name ?? "",
});

export const handleHousePropertySocket = (
    queryClient: QueryClient,
    message: any,
    currentUserId: string | undefined | number
) => {
    //if (message.updatedBy == currentUserId) return;

    if (message.type === "create") {
        queryClient.invalidateQueries({
            queryKey: ["houseProperty"],
        });
        return;
    }

    const relevantQueries = getRelevantQueries(queryClient, "houseProperty");

    relevantQueries.forEach((query) => {
        const oldData = queryClient.getQueryData(query.queryKey);

        if (!oldData) {
            queryClient.invalidateQueries({ queryKey: query.queryKey });
            return;
        }
        queryClient.setQueryData(query.queryKey, (oldData: any) => {
            if (!oldData) {
                return oldData;
            }
            if (message.type === "update") {
                console.log("update", oldData);
                if (Array.isArray(oldData)) {
                    const flattenedUpdate = flattenHousePropertyData(
                        message.data
                    );

                    const exists = oldData.some(
                        (item: any) => item.id === flattenedUpdate.id
                    );

                    if (!exists) {
                        queryClient.invalidateQueries({
                            queryKey: query.queryKey,
                        });
                        console.log("does not exist", query.queryKey);
                        return;
                    }

                    console.log("exits");

                    return oldData.map((item: any) =>
                        item.id === flattenedUpdate.id
                            ? { ...item, ...flattenedUpdate }
                            : item
                    );
                } else {
                    if (oldData.id === message.data.id) {
                        return { ...oldData, ...message.data };
                    }
                }
            }

            if (message.type === "delete") {
                if (Array.isArray(oldData)) {
                    return oldData.filter(
                        (item: any) => item.id !== message.data.id
                    );
                }
            }

            return oldData;
        });
    });
};
