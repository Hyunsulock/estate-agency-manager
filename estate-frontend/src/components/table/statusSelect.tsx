import { useUpdateHouseProperty } from "@/app/lib/useMutationFunctions/useUpdateHouseProperty";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { HousePropertyStatus } from "./types";

export const StatusSelect = ({
    id,
    currentStatus,
}: {
    id: number;
    currentStatus: string;
}) => {
    const { mutate } = useUpdateHouseProperty();

    return (
        <Select
            value={currentStatus}
            onValueChange={(value) => mutate({ id, json: { status: value } })}
        >
            <SelectTrigger className="h-8 w-40" id={`${id}-status`}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
                {Object.values(HousePropertyStatus).map((preSetstatus) => (
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
