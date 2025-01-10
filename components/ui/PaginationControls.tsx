'use client'

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
}

export function PaginationControls({ currentPage, totalPages }: PaginationControlsProps) {
    const router = useRouter();

    return (
        <div className="mt-8 flex justify-center gap-2">
            <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => router.push(`?page=${currentPage - 1}`)}
            >
                Previous
            </Button>
            <span className="flex items-center px-4">
                Page {currentPage} of {totalPages}
            </span>
            <Button
                variant="outline"
                disabled={currentPage >= totalPages}
                onClick={() => router.push(`?page=${currentPage + 1}`)}
            >
                Next
            </Button>
        </div>
    );
}