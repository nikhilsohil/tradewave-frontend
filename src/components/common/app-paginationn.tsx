"use client";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

import React from "react";
type PaginationData = {
    page: number;
    totalPages: number;
};

type PaginationProps = {
    paginationData: PaginationData;
    setCurrentPage: (page: number) => void;
    className?: string;
};

const AppPagination: React.FC<PaginationProps> = ({
    paginationData,
    setCurrentPage,
    className,
}) => {
    if (!paginationData) {
        return null;
    }

    const [newPaginationData, setNewPaginationData] = React.useState(paginationData);
    const { page = 1, totalPages = 1 } = newPaginationData;
    const canPreviousPage = page > 1;
    const canNextPage = page < totalPages;

    const goPreviousPage = () => {
        console.log("goPreviousPage");
        setCurrentPage(page - 1);
    };
    const goNextPage = () =>
        canNextPage ? setCurrentPage(page + 1) : null;

    React.useEffect(() => {
        if (paginationData?.page) {
            setNewPaginationData(paginationData);
        }
    }, [paginationData]);



    return (
        <>
            <div
                className={cn(
                    `flex justify-between items-center w-full pt-4`,
                    className
                )}
            >
                <div>
                    <Pagination>
                        <PaginationContent>
                            {page > 2 && (
                                <>
                                    <PaginationItem>
                                        <PaginationLink
                                            onClick={() => setCurrentPage(1)}
                                            href="#"
                                            isActive
                                            className="cursor-pointer"
                                        >
                                            1
                                        </PaginationLink>
                                    </PaginationItem>
                                    {page > 3 && (
                                        <PaginationItem>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    )}
                                </>
                            )}
                            {page > 1 && (
                                <PaginationItem >
                                    <PaginationLink
                                        isActive
                                        onClick={() => setCurrentPage(page - 1)}
                                        className="cursor-pointer"
                                    >
                                        {page - 1}
                                    </PaginationLink>
                                </PaginationItem>
                            )}
                            <PaginationItem>
                                <PaginationLink isActive className="cursor-pointer px-2 py-1 rounded-md border-2 border-blue-500"> {page}</PaginationLink>
                            </PaginationItem>
                            {page < totalPages - 1 && (
                                <>
                                    <PaginationItem>
                                        <PaginationLink
                                            isActive
                                            onClick={() => setCurrentPage(page + 1)}
                                            className="cursor-pointer"
                                        >
                                            {" "}
                                            {page + 1}
                                        </PaginationLink>
                                    </PaginationItem>

                                    {page < totalPages - 2 && (
                                        <PaginationItem>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    )}
                                </>
                            )}
                            {page < totalPages && (
                                <>
                                    <PaginationItem>
                                        <PaginationLink
                                            onClick={() => setCurrentPage(totalPages)}
                                            isActive
                                            className="cursor-pointer"
                                        >
                                            {" "}
                                            {totalPages}
                                        </PaginationLink>
                                    </PaginationItem>
                                </>
                            )}
                        </PaginationContent>
                    </Pagination>
                </div>

                <div>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    className={`border ${canNextPage
                                        ? "cursor-pointer"
                                        : "opacity-50 disabled:cursor-not-allowed"
                                        } `}
                                    onClick={canPreviousPage ? goPreviousPage : undefined}
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext
                                    className={`border ${canNextPage
                                        ? "cursor-pointer"
                                        : "opacity-50 disabled:cursor-not-allowed"
                                        }`}
                                    onClick={canNextPage ? goNextPage : undefined}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </>
    );
};

export default AppPagination;
