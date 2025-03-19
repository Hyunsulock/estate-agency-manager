export enum HousePropertyStatus {
    ACTIVE = "active",
    TODO = "todo",
    FIND_OWNER = "found_owner",
    FIND_BUYER = "found_buyer",
    MATCHING = "matching",
    DEAL = "deal",
    DONE = "done"
}

export enum tradeTypes {
    JEONSE = "jeonse",
    RENT = "rent",
    SALE = "sale",
}


export type HouseProperty = {
    id: number;
    size: number;
    room: number;
    status: HousePropertyStatus;  // ✅ Use union types for fixed string values
    buildingnumber: number;
    floor: string;  // ✅ If it can be a string, allow both types
    unitnumber: number | null;
    tradetype: "rent" | "sale" | 'jeonse';  // ✅ Union type for trade type
    offercount: number; // ✅ If count is a number but can be a string
    minjeonsedeposit: number | null;
    maxjeonsedeposit: number | null;
    minrentprice: number | null;
    maxrentprice: number | null;
    minrentdeposit: number | null;
    maxrentdeposit: number | null;
    minsaleprice: number | null;
    maxsaleprice?: number | null;  // ✅ Optional with null support
    savedStatus: boolean;
}