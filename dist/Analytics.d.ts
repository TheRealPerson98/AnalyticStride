import React from 'react';
interface AnalyticsProps {
    onCollect?: (data: AnalyticsData) => void;
    endpoint?: string;
    apiKey?: string;
}
interface AnalyticsData {
    pathname: string;
    timestamp: number;
    referrer: string;
    userAgent: string;
    screenResolution: string;
    language: string;
    hostname: string;
}
export declare const Analytics: React.FC<AnalyticsProps>;
export {};
