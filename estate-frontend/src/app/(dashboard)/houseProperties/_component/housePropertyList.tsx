"use client";

import { useQuery } from "@tanstack/react-query";
import {getHouseProperties} from "../../../lib/queryFunctions/getHouseProperties";
import HousePropertyItem from "./housePropertyItem";
import { useGetHouseProperties } from "@/app/lib/useGetFunctions/useGetHouseProperties";

export default function HousePropertyLists() {
    const { data } = useGetHouseProperties({})
    return data?.map((houseProperty: any) => {
        return (
            <div>
                <div>hello</div>
                <HousePropertyItem
                    key={houseProperty.id}
                    houseProperty={houseProperty}
                />
            </div>
        );
    });
}
