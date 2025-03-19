"use client";
import { useQuery } from "@tanstack/react-query";
import { getSingleHouseProperty } from "../../../../lib/queryFunctions/getSingleHouseProperty";
import { useGetSingleHouseProperty } from "@/app/lib/useGetFunctions/useGetSingleHouse";

type Props = {
    id: string;
};

export default function SingleHouseProperty({ id }: Props) {
    
    const{ data }= useGetSingleHouseProperty(id)

    return (
        <div>
            <div>
                <span>id: {data.id}</span>
                <span>room: {data.room}</span>
                <span>size: {data.size}</span>
            </div>
        </div>
    );
}
