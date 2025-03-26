import DealsTableSwitcher from "./_component/dealsTabSwitcher";

export default async function DealsPage() {
    console.log("reloading");
    return (
        <div>
            {/* <HydrationBoundary state={dehydratedState}>
                <Suspense fallback={<div></div>}> */}
            <DealsTableSwitcher />
            {/* </Suspense>
            </HydrationBoundary> */}
        </div>
    );
}
