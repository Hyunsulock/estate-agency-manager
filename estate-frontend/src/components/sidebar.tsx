import Link from "next/link";
import { Navigation } from "./navigation";

export const Siderbar = () => {
    return (
        <aside className="h-full bg-neutral-100 p-4 w-full">
            <Link href="/">
                <div>Numatus</div>
            </Link>
            <Navigation/>
        </aside>
    );
};
