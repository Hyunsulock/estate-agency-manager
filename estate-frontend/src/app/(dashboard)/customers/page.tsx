// CustomersPage.tsx with enhanced search (name, phoneNumber, intro)
"use client";

import { useState } from "react";
import { useGetCustomersQuery } from "@/app/lib/useGetFunctions/useGetCustomersQuery";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { customerColumns } from "@/components/table/customerColumns";
import { DataTable } from "@/components/table/dataTable";
import { Button } from "@/components/ui/button";

import { useCreateModal } from "@/hooks/useCreateModal";
import { CreateCustomerModal } from "@/components/modal/createCustomerModal";

export default function CustomersPage() {
    const [localFilters, setLocalFilters] = useState({
        name: "",
        phoneNumber: "",
        intro: "",
    });
    const [filters, setFilters] = useState({
        name: "",
        phoneNumber: "",
        intro: "",
    });

    const { data: customers, isLoading } = useGetCustomersQuery({
        name: filters.name || null,
        phoneNumber: filters.phoneNumber || null,
        intro: filters.intro || null,
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

    const { open } = useCreateModal("create-customer");

    return (
        <div className="p-6">
            <CreateCustomerModal />
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Input
                        className="h-8"
                        placeholder="Search by name"
                        name="name"
                        value={localFilters.name}
                        onChange={handleLocalChange}
                        onBlur={handleBlur}
                    />
                    <Input
                        className="h-8"
                        placeholder="Search by phone number"
                        name="phoneNumber"
                        value={localFilters.phoneNumber}
                        onChange={handleLocalChange}
                        onBlur={handleBlur}
                    />
                    <Input
                        className="h-8"
                        placeholder="Search by intro keyword"
                        name="intro"
                        value={localFilters.intro}
                        onChange={handleLocalChange}
                        onBlur={handleBlur}
                    />
                </div>
                <Button onClick={open}>Create Customer</Button>
            </div>
            {isLoading ? (
                <div className="text-center py-8">Loading customers...</div>
            ) : (
                <DataTable columns={customerColumns} data={customers || []} />
            )}
        </div>
    );
}
