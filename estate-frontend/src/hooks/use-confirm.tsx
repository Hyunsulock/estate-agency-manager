import { useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { ResponsiveModal } from "@/components/responsive-modal";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const useConfirm = (title: string, message: string) => {
    const [promise, setPromise] = useState<{
        resolve: (value: boolean) => void;
    } | null>(null);

    const confirm = () => {
        return new Promise<boolean>((resolve) => {
            setPromise({ resolve });
        });
    };

    const handleClose = () => {
        setPromise(null);
    };

    const handleConfirm = () => {
        promise?.resolve(true);
        setPromise(null);
    };

    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    };

    const ConfirmDialog = () => (
        <ResponsiveModal open={promise !== null} onOpenChange={handleClose}>
            <Card className="w-full h-full border-none shadow-none">
                <CardContent className="pt-8">
                    <CardHeader className="p-0">
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{message}</CardDescription>
                    </CardHeader>
                    <div className="flex gap-4 mt-4">
                    <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="w-full lg:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant="outline"
                        className="w-full lg:w-auto text-amber-700"
                    >
                        Confirm
                    </Button>
                    </div>
                </CardContent>
            </Card>
        </ResponsiveModal>
    );

    return { confirm, ConfirmDialog };
};
