"use client";

import { TrendingUp } from "lucide-react";
import { RadialBarChart, RadialBar, PolarRadiusAxis, Label } from "recharts";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

type Props = {
    title: string;
    create: number;
    update: number;
    delete: number;
};

export const UpdateDeleteRadialCard = ({
    title,
    create,
    update,
    delete: del,
}: Props) => {
    const chartData = [
        {
            name: title,
            create,
            update,
            delete: del,
        },
    ];

    const total = create + update + del;

    const chartConfig = {
        delete: {
            label: "Delete",
            color: "hsl(var(--chart-1))",
        },
        create: {
            label: "Create",
            color: "hsl(var(--chart-2))",
        },
        update: {
            label: "Update",
            color: "hsl(var(--chart-4))",
        },
    };

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{title} Activity</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 items-center pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-[250px]"
                >
                    <RadialBarChart
                        data={chartData}
                        endAngle={180}
                        innerRadius={80}
                        outerRadius={130}
                    >
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
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
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy ?? 0) - 16}
                                                    className="fill-foreground text-2xl font-bold"
                                                >
                                                    {total.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy ?? 0) + 4}
                                                    className="fill-muted-foreground"
                                                >
                                                    activities
                                                </tspan>
                                                <tspan
                                                    x={(viewBox.cx ?? 0) + 55}
                                                    y={(viewBox.cy ?? 0) + 35}
                                                    className="fill-foreground text-xl font-bold"
                                                >
                                                    {create.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={(viewBox.cx ?? 0) + 55}
                                                    y={(viewBox.cy ?? 0) + 55}
                                                    className="fill-muted-foreground"
                                                >
                                                    Created
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy ?? 0) + 35}
                                                    className="fill-foreground text-xl font-bold"
                                                >
                                                    {update.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy ?? 0) + 55}
                                                    className="fill-muted-foreground"
                                                >
                                                    Updated
                                                </tspan>
                                                <tspan
                                                    x={(viewBox.cx ?? 0) - 55}
                                                    y={(viewBox.cy ?? 0) + 35}
                                                    className="fill-foreground text-xl font-bold"
                                                >
                                                    {del.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={(viewBox.cx ?? 0) - 55}
                                                    y={(viewBox.cy ?? 0) + 55}
                                                    className="fill-muted-foreground"
                                                >
                                                    Deleted
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                        <RadialBar
                            dataKey="create"
                            stackId="a"
                            cornerRadius={0}
                            fill="var(--color-create)"
                            className="stroke-transparent stroke-2"
                        />
                        <RadialBar
                            dataKey="update"
                            stackId="a"
                            cornerRadius={0}
                            fill="var(--color-update)"
                            className="stroke-transparent stroke-2"
                        />
                        <RadialBar
                            dataKey="delete"
                            stackId="a"
                            cornerRadius={0}
                            fill="var(--color-delete)"
                            className="stroke-transparent stroke-2"
                        />
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};
