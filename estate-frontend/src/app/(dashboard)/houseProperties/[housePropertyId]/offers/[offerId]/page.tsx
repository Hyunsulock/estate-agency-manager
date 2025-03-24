import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { RealtimeOfferEditForm } from "./_component/singleOfferEditView";
import { getSingleOffer } from "@/app/lib/queryFunctions/getSingleOfferById";


type Props = {
    params: Promise<{ housePropertyId: string, offerId: string }>;
};

export default async function OfferDetailPage({ params }: Props) {
    const { housePropertyId, offerId } = await params;


    return (
        <main>
                <RealtimeOfferEditForm offerId={offerId} housePropertyId={housePropertyId}/>
        </main>
    );
}


