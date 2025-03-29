
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
