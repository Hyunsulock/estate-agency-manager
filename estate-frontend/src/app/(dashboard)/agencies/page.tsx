"use client";

import { useState } from "react";
import { useGetAgencies } from "@/app/lib/useGetFunctions/useGetAgencies";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { agencyColumns } from "@/components/table/agencyColumns";
import { DataTable } from "@/components/table/dataTable";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useGetAgenciesQuery } from "@/app/lib/useGetFunctions/useGetAgenciesQuery";
import { CreateAgencyForm } from "@/components/modal/createAgencyForm";
import { CreateAgencyModal } from "@/components/modal/createAgencyModal";
import { useCreateModal } from "@/hooks/useCreateModal";

export default function AgenciesPage() {
    const router = useRouter();

    const [localFilters, setLocalFilters] = useState({
        name: "",
        phoneNumber: "",
        location: "",
    });
    const [filters, setFilters] = useState({
        name: "",
        phoneNumber: "",
        location: "",
    });

    const { data: agencies, isLoading } = useGetAgenciesQuery({
        name: filters.name || null,
        phoneNumber: filters.phoneNumber || null,
        location: filters.location || null,
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

    const handleCreateClick = () => {
        router.push("/agencies/create");
    };

    const { open } = useCreateModal("create-agency");

    return (
        <div className="p-6">
            <CreateAgencyModal />
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Input
                        className="h-10"
                        placeholder="Search by name"
                        name="name"
                        value={localFilters.name}
                        onChange={handleLocalChange}
                        onBlur={handleBlur}
                    />
                    <Input
                        className="h-10"
                        placeholder="Search by phone number"
                        name="phoneNumber"
                        value={localFilters.phoneNumber}
                        onChange={handleLocalChange}
                        onBlur={handleBlur}
                    />
                    <Input
                        className="h-10"
                        placeholder="Search by location"
                        name="location"
                        value={localFilters.location}
                        onChange={handleLocalChange}
                        onBlur={handleBlur}
                    />
                </div>
                <Button onClick={open}>Create Agency</Button>
            </div>
            {isLoading ? (
                <div className="text-center py-8">Loading agencies...</div>
            ) : (
                <DataTable columns={agencyColumns} data={agencies || []} />
            )}
        </div>
    );
}
