"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { useParams } from "next/navigation";
import { useGetSingleDeal } from "@/app/lib/useGetFunctions/useGetSingleDeal";
import { RealtimeDealEditView } from "./_component/realtimeDealEditView";

export default function DealDetailPage() {
    const { dealId } = useParams<{ dealId: string }>();
    const { data: deal, isLoading } = useGetSingleDeal(dealId);

    if (isLoading) return <div>Loading deal details...</div>;
    if (!deal) return <div>No deal found.</div>;

    const { houseProperty, offer } = deal;

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
            <Card>
                <CardHeader>
                    <CardTitle>House Property Info</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Apartment: {houseProperty.apartment.name}</p>
                    <p>
                        B/U number: {houseProperty.buildingNumber} Building /{" "}
                        {houseProperty.unitNumber} Unit
                    </p>
                    <p>Status: {houseProperty.status}</p>
                    {/* 필요한 정보들 추가 */}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Offer Info</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Trade Type: {offer?.tradeType ?? "-"}</p>
                    {offer?.tradeType === "sale" && (
                        <p>
                            Sale Price:{" "}
                            {offer?.salePrice?.toLocaleString() ?? "-"}
                        </p>
                    )}
                    {offer?.tradeType === "jeonse" && (
                        <p>
                            Jeonse Deposit:{" "}
                            {offer?.jeonseDeposit?.toLocaleString() ?? "-"}
                        </p>
                    )}
                    {offer?.tradeType === "rent" && (
                        <>
                            <p>
                                Rent Deposit:{" "}
                                {offer?.rentDeposit?.toLocaleString() ?? "-"}
                            </p>
                            <p>
                                Rent Price:{" "}
                                {offer?.rentPrice?.toLocaleString() ?? "-"}
                            </p>
                        </>
                    )}
                    <p>Status: {offer?.status ?? "-"}</p>
                    <p>Key Features: {offer?.keyFeatures ?? "-"}</p>
                    <p>Agency: {offer?.agency.name ?? "-"} - {offer?.agency.phoneNumber}</p>
                </CardContent>
            </Card>

            <div className="col-span-full">
                <RealtimeDealEditView dealId={dealId} />
            </div>
        </div>
    );
}
