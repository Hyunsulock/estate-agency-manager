import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Pencil1Icon } from "@radix-ui/react-icons";
import {
    ExternalLink,
    ExternalLinkIcon,
    PencilIcon,
    TrashIcon,
} from "lucide-react";

interface TableActionProps {
    id: number;
    children: React.ReactNode;
}

export const TableActions = ({ id, children }: TableActionProps) => {
    return (
        <div className="flex justify-end">
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem
                        onClick={() => {}}
                        disabled={false}
                        className="p-[9px] flex items-center"
                    >
                        <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
                        Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {}}
                        disabled={false}
                        className="p-[9px] flex items-center"
                    >
                        <PencilIcon className="size-4 mr-2 stroke-2" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {}}
                        disabled={false}
                        className="text-amber-700 foucs:text-amber-700 p-[9px] flex items-center"
                    >
                        <TrashIcon className="size-4 mr-2 stroke-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
