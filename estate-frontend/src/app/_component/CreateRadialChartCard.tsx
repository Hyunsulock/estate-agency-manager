"use client";

import { TrendingUp } from "lucide-react";
import {
    RadialBarChart,
    RadialBar,
    PolarGrid,
    PolarRadiusAxis,
    Label,
} from "recharts";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

type Props = {
    title: string;
    value: number;
};

export const CreateRadialChartCard = ({ title, value }: Props) => {
    const chartData = [
        {
            name: title,
            visitors: value,
            fill: "hsl(var(--chart-2))",
        },
    ];

    const chartConfig = {
        visitors: {
            label: "Visitors",
        },
    };

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{title}</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <RadialBarChart
                        data={chartData}
                        endAngle={180}
                        innerRadius={80}
                        outerRadius={150}
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                        />
                        <RadialBar dataKey="visitors" background />
                        <PolarRadiusAxis tick={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (
                                        viewBox &&
                                        "cx" in viewBox &&
                                        "cy" in viewBox
                                    ) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    className="fill-foreground text-4xl font-bold"
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                >
                                                    {value.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    className="fill-muted-foreground"
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy ?? 0) + 24}
                                                >
                                                    Created
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};
