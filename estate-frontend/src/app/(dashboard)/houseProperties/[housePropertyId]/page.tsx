import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import SingleHouseProperty from "./_component/singleHouseProperty";
import { getSingleHouseProperty } from "../../../lib/queryFunctions/getSingleHouseProperty";
import { RealtimeEditForm } from "./_component/singleHousePropertyEditView";
import SingleHousePropertyLayout from "./_component/singleHousePropertyLayout";

type Props = {
    params: Promise<{ housePropertyId: string }>;
};

export default async function HouseProperty({ params }: Props) {
    const { housePropertyId } = await params;
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["houseProperty", housePropertyId],
        queryFn: getSingleHouseProperty,
    });
    const dehydratedState = dehydrate(queryClient);
    return (
        <main>
            <HydrationBoundary state={dehydratedState}>
                {/* <RealtimeEditForm id={housePropertyId} /> */}
                <SingleHousePropertyLayout id={housePropertyId} />
            </HydrationBoundary>
        </main>
    );
}
