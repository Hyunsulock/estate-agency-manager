import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";


type Props = {
    params: Promise<{ housePropertyId: string, offerId: string }>;
};

export default async function OfferDetailPage({ params }: Props) {
    const { housePropertyId, offerId } = await params;
    // const queryClient = new QueryClient();
    // await queryClient.prefetchQuery({
    //     queryKey: ["houseProperty", housePropertyId],
    //     queryFn: getSingleHouseProperty,
    // });
    // const dehydratedState = dehydrate(queryClient);
    return (
        // <main>
        //     <HydrationBoundary state={dehydratedState}>
        //         {/* <RealtimeEditForm id={housePropertyId} /> */}
        //         <SingleHousePropertyLayout id={housePropertyId} />
        //     </HydrationBoundary>
        // </main>
        <div>
            <h1>Offer ID: {offerId}</h1>
            <p>Related to house property ID: {housePropertyId}</p>
        </div>
    );
}


