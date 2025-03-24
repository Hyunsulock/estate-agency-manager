// // components/HousePropertyBarChart.tsx
// "use client";

// import { TrendingUp } from "lucide-react";
// import {
//     Bar,
//     BarChart,
//     CartesianGrid,
//     LabelList,
//     XAxis,
//     YAxis,
// } from "recharts";
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
// import {
//     ChartConfig,
//     ChartContainer,
//     ChartTooltip,
//     ChartTooltipContent,
// } from "@/components/ui/chart";

// const chartData = [
//     { month: "Jan", views: 186 },
//     { month: "Feb", views: 305 },
//     { month: "Mar", views: 237 },
//     { month: "Apr", views: 73 },
//     { month: "May", views: 209 },
//     { month: "Jun", views: 214 },
// ];

// const chartConfig = {
//     views: {
//         label: "Views",
//         color: "hsl(var(--chart-1))",
//     },
//     label: {
//         color: "hsl(var(--background))",
//     },
// } satisfies ChartConfig;

// export const OfferBarChart = () => {
//     return (
//         <Card className="w-full h-full shadow-lg flex flex-col max-h-[440px] mt-8">
//             <CardHeader>
//                 <CardTitle>Property Activity</CardTitle>
//                 <CardDescription>Last 6 months view stats</CardDescription>
//             </CardHeader>
//             <CardContent >
//                 <ChartContainer config={chartConfig}>
//                     <BarChart
//                         accessibilityLayer
//                         data={chartData}
//                         layout="vertical"
//                         margin={{ right: 16 }}
//                     >
//                         <CartesianGrid horizontal={false} />
//                         <YAxis
//                             dataKey="month"
//                             type="category"
//                             tickLine={false}
//                             tickMargin={10}
//                             axisLine={false}
//                         />
//                         <XAxis type="number" hide />
//                         <ChartTooltip
//                             cursor={false}
//                             content={<ChartTooltipContent indicator="line" />}
//                         />
//                         <Bar
//                             dataKey="views"
//                             fill="var(--color-views)"
//                             radius={4}
//                         >
//                             <LabelList
//                                 dataKey="month"
//                                 position="insideLeft"
//                                 offset={8}
//                                 className="fill-[--color-label]"
//                                 fontSize={12}
//                             />
//                             <LabelList
//                                 dataKey="views"
//                                 position="right"
//                                 offset={8}
//                                 className="fill-foreground"
//                                 fontSize={12}
//                             />
//                         </Bar>
//                     </BarChart>
//                 </ChartContainer>
//             </CardContent>
//             <CardFooter className="flex-col items-start gap-2 text-sm">
//                 <div className="flex gap-2 font-medium leading-none">
//                     Trending up by 5.2% this month{" "}
//                     <TrendingUp className="h-4 w-4" />
//                 </div>
//                 <div className="leading-none text-muted-foreground">
//                     Showing activity from the last 6 months
//                 </div>
//             </CardFooter>
//         </Card>
//     );
// };

"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    LabelList,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface OfferBarChartProps {
    offers: any[];
    tradeType: string;
    isLoading: boolean;
}

export const OfferBarChart = ({
    offers,
    tradeType,
    isLoading,
}: OfferBarChartProps) => {
    if (isLoading) return <div className="p-4">Loading chart...</div>;

    // Build chart data by agency
    const chartData = offers.reduce((acc: any, offer: any) => {
        const agencyName = offer.agency?.name || "Unknown";
        const existing = acc.find((entry: any) => entry.agency === agencyName);
        const valueKey =
            tradeType === "sale"
                ? "salePrice"
                : tradeType === "jeonse"
                ? "jeonseDeposit"
                : "rentPrice";

        if (existing) {
            existing[valueKey] =
                (existing[valueKey] ?? 0) + (offer[valueKey] ?? 0);
            existing.count = (existing.count ?? 0) + 1;
        } else {
            acc.push({
                agency: agencyName,
                [valueKey]: offer[valueKey] ?? 0,
                count: 1,
            });
        }
        return acc;
    }, []);

    const chartConfig = {
        salePrice: {
            label: "Sale Price",
            color: "hsl(var(--chart-1))",
        },
        jeonseDeposit: {
            label: "Jeonse Deposit",
            color: "hsl(var(--chart-2))",
        },
        rentPrice: {
            label: "Rent Price",
            color: "hsl(var(--chart-3))",
        },
        label: {
            color: "hsl(var(--background))",
        },
    } satisfies ChartConfig;

    const valueKey =
        tradeType === "sale"
            ? "salePrice"
            : tradeType === "jeonse"
            ? "jeonseDeposit"
            : "rentPrice";

    return (
        <Card className="w-full h-full shadow-lg flex flex-col max-h-[440px] mt-8">
            <CardHeader>
                <CardTitle>Offer Chart by Agency ({tradeType})</CardTitle>
                <CardDescription>
                    Showing offer totals by agency
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{
                            right: 16,
                        }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="agency"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <XAxis type="number" />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar
                            dataKey={valueKey}
                            fill="var(--color-desktop)"
                            radius={4}
                        >
                            <LabelList
                                dataKey="agency"
                                position="insideLeft"
                                offset={8}
                                className="fill-[--color-label]"
                                fontSize={12}
                            />
                            <LabelList
                                dataKey={valueKey}
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};
