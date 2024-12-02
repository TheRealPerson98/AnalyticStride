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
    eventType?: string;
    buttonName?: string;
    buttonText?: string;
}
interface WithTrackingProps {
    trackingName?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    children?: React.ReactNode;
    [key: string]: any;
}
export declare const AnalyticsContext: React.Context<{
    trackEvent: (eventData: Partial<AnalyticsData>) => Promise<void>;
}>;
export declare const Analytics: React.FC<AnalyticsProps>;
export declare const withTracking: (WrappedButton: React.ComponentType<any>) => React.ForwardRefExoticComponent<Omit<WithTrackingProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;
export declare const TrackedButton: React.FC<WithTrackingProps>;
export {};
