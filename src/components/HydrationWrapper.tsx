"use client";

import { HydrationBoundary } from "@tanstack/react-query";

interface HydrationWrapperProps {
    children: React.ReactNode;
    dehydratedState?: any;
}

export default function HydrationWrapper({ children, dehydratedState }: HydrationWrapperProps) {
    return <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>;
}
