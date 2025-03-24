import { useUpdateHouseProperty } from "@/app/lib/useMutationFunctions/useUpdateHouseProperty";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { HousePropertyStatus, offerStatus } from "./types";
import { useUpdateOffer } from "@/app/lib/useMutationFunctions/useUpdateOffer";

export const StatusSelectOffer = ({
    id,
    currentStatus,
}: {
    id: number;
    currentStatus: string;
}) => {
    const { mutate } = useUpdateOffer();

    return (
        <Select
            value={currentStatus}
            onValueChange={(value) => mutate({ id, json: { status: value } })}
        >
            <SelectTrigger className="h-8 w-40" id={`${id}-status`}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
                {Object.values(offerStatus).map((preSetstatus) => (
                    <SelectItem key={preSetstatus} value={preSetstatus}>
                        {preSetstatus.toUpperCase()}
                    </SelectItem>
                ))}
                {/* <SelectItem value="active">Active</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="onhold">On Hold</SelectItem> */}
            </SelectContent>
        </Select>
    );
};
