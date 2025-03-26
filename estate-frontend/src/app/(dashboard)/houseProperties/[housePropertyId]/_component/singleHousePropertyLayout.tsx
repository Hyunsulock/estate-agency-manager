"use client";
import { useQuery } from "@tanstack/react-query";
import { getSingleHouseProperty } from "../../../../lib/queryFunctions/getSingleHouseProperty";
import { useGetSingleHouseProperty } from "@/app/lib/useGetFunctions/useGetSingleHouse";
import { RealtimeEditForm } from "./singleHousePropertyEditView";
import { OfferBarChart } from "./offerBarChart";
import { useQueryState } from "nuqs";
import { useGetOffersByHouseProperty } from "@/app/lib/useGetFunctions/useGetOffersByHouseProperty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OfferTable } from "./offerTable";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { CreateOfferModal } from "@/components/modal/createOfferModal";
import { useCreateModal } from "@/hooks/useCreateModal";

export default function SingleHousePropertyLayout({ id }: { id: string }) {
    const [offerTradeType, setOfferTradeType] = useQueryState("tradeType", {
        defaultValue: "sale",
        shallow: false,
        clearOnDefault: false,
    });

    const { data: offers, isLoading: offersLoading } =
        useGetOffersByHouseProperty(id, offerTradeType);

    const handleTabChange = (value: string) => {
        setOfferTradeType(value); // ✅ Instantly update state & URL
    };

    const { open } = useCreateModal("create-offer");
    return (
        <div>
            <CreateOfferModal housePropertyId={Number(id)} />
            <div className="flex flex-wrap justify-center gap-6 p-4">
                <div className="w-full sm:w-auto min-w-[480px]">
                    <RealtimeEditForm id={id} />
                </div>
                <div className="w-full sm:w-auto lg:min-w-[600px] min-w-[480px]">
                    <OfferBarChart
                        offers={offers ?? []}
                        tradeType={offerTradeType}
                        isLoading={offersLoading}
                    />
                </div>
            </div>
            <Tabs
                value={offerTradeType}
                onValueChange={handleTabChange}
                className="p-4 mt-2"
            >
                <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
                    <TabsList>
                        <TabsTrigger value="sale">Sale</TabsTrigger>
                        <TabsTrigger value="jeonse">Jeonse</TabsTrigger>
                        <TabsTrigger value="rent">Rent</TabsTrigger>
                    </TabsList>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full lg:w-auto"
                        onClick={open}
                    >
                        <PlusIcon className="size-4 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">Add Offer</span>
                    </Button>
                </div>
                <TabsContent value={offerTradeType}>
                    <OfferTable
                        offers={offers ?? []}
                        isLoading={offersLoading}
                        tradeType={offerTradeType}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
