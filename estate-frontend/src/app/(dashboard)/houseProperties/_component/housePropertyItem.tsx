"use client";
import { HouseProperty } from "@/model/houseProperty";
import { useRouter } from "next/navigation";

type Props = {
    houseProperty: any;
};

export default function HousePropertyItem({ houseProperty }: Props) {
    const router = useRouter();
    const onClick = () => {
        router.push(`/houseProperties/${houseProperty.id}`);
    };

    return (
        <article onClickCapture={onClick}>
            <div>
                <span>id: {houseProperty.id}</span>
                <span>room: {houseProperty.room}</span>
                <span>size: {houseProperty.size}</span>
            </div>
        </article>
    );
}
