import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import SingleHouseProperty from "./_component/singleHouseProperty";
import { getSingleHouseProperty } from "../../../lib/queryFunctions/getSingleHouseProperty";

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
                <SingleHouseProperty id={housePropertyId} />
            </HydrationBoundary>
        </main>
    );
}
