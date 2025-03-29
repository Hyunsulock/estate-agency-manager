import { TableSwitcher } from "./_component/tableSwitcher";
import { HousePropertyStatus } from "@/components/table/types";
type Props = {
    searchParams: { [key: string]: string | string[] | undefined };
};
function isHousePropertyStatus(value: any): value is HousePropertyStatus {
    return Object.values(HousePropertyStatus).includes(value);
}

import { tradeTypes } from "@/components/table/types";

function isTradeType(value: any): value is tradeTypes {
    return Object.values(tradeTypes).includes(value);
}

export default async function HouseProperties({ searchParams }: Props) {
    // const rawStatus = searchParams.status;
    // const status = isHousePropertyStatus(rawStatus) ? rawStatus : null;
    // const rawTradeType = Array.isArray(searchParams.tradeType)
    //     ? searchParams.tradeType[0]
    //     : searchParams.tradeType;

    // const tradeType =
    //     rawTradeType && isTradeType(rawTradeType) ? rawTradeType : null;

    // const queryClient = new QueryClient();

    // await queryClient.prefetchQuery({
    //     queryKey: ["houseProperty", { status , tradeType}],
    //     queryFn: getHouseProperties,
    // });

    // const dehydratedState = dehydrate(queryClient);
    console.log("reloading");
    return (
        <div>
            {/* <HydrationBoundary state={dehydratedState}>
                <Suspense fallback={<div></div>}> */}
            <TableSwitcher />
            {/* </Suspense>
            </HydrationBoundary> */}
        </div>
    );
}
