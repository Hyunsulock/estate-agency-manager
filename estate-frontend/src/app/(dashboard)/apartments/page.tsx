"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { DataTable } from "@/components/table/dataTable";
import { Button } from "@/components/ui/button";

import { useCreateModal } from "@/hooks/useCreateModal";
import { apartmentColumns } from "@/components/table/apartmentColumns";
import { useGetApartmentsQuery } from "@/app/lib/useGetFunctions/useGetApartmentsQuery";
import { CreateApartmentModal } from "@/components/modal/createApartmentModal";

export default function ApartmentsPage() {
    const [localFilters, setLocalFilters] = useState({
        name: "",
        address: "",
    });

    const [filters, setFilters] = useState({
        name: "",
        address: "",
    });

    const { data: apartments, isLoading } = useGetApartmentsQuery({
        name: filters.name || null,
        address: filters.address || null,
    });

    const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: localFilters[name as keyof typeof localFilters],
        }));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const { name } = e.currentTarget;
            setFilters((prev) => ({
                ...prev,
                [name]: localFilters[name as keyof typeof localFilters],
            }));
        }
    };

    const { open } = useCreateModal("create-apartment");

    return (
        <div className="p-6">
            <CreateApartmentModal />
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Input
                        className="h-8"
                        placeholder="Search by name"
                        name="name"
                        value={localFilters.name}
                        onChange={handleLocalChange}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                    />
                    <Input
                        className="h-8"
                        placeholder="Search by address"
                        name="address"
                        value={localFilters.address}
                        onChange={handleLocalChange}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <Button onClick={open}>Create Apartment</Button>
            </div>
            {isLoading ? (
                <div className="text-center py-8">Loading apartments...</div>
            ) : (
                <DataTable columns={apartmentColumns} data={apartments || []} />
            )}
        </div>
    );
}
