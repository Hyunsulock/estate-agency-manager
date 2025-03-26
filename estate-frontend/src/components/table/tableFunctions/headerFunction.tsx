import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export function headerFc(column: any, name: string) {
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {name}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );
}