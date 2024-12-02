'use client';

import React, { useEffect, useCallback } from 'react';

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
  [key: string]: any; // For other button props
}

// Context to share analytics functionality
export const AnalyticsContext = React.createContext<{
  trackEvent: (eventData: Partial<AnalyticsData>) => Promise<void>;
}>({
  trackEvent: async () => {},
});

export const Analytics: React.FC<AnalyticsProps> = ({ 
  onCollect,
  endpoint = 'https://api.analyticstride.com',
  apiKey = 'public'
}) => {
  const trackEvent = useCallback(async (eventData: Partial<AnalyticsData>) => {
    try {
      const data: AnalyticsData = {
        pathname: window.location.pathname,
        timestamp: Date.now(),
        referrer: document.referrer || 'direct',
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        hostname: window.location.hostname,
        ...eventData
      };

      if (onCollect) {
        onCollect(data);
      }

      const response = await fetch(`${endpoint}/collect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify(data),
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Analytics error:', error);
      }
    }
  }, [onCollect, endpoint, apiKey]);

  useEffect(() => {
    // Track page view on mount
    trackEvent({ eventType: 'pageview' });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        trackEvent({ eventType: 'pageview' });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [trackEvent]);

  return (
    <AnalyticsContext.Provider value={{ trackEvent }}>
      {null}
    </AnalyticsContext.Provider>
  );
};

// Higher-order component for tracking button clicks
export const withTracking = (WrappedButton: React.ComponentType<any>) => {
  return React.forwardRef<HTMLButtonElement, WithTrackingProps>(({ 
    trackingName,
    onClick,
    children,
    ...props 
  }, ref) => {
    const { trackEvent } = React.useContext(AnalyticsContext);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      // Track the button click
      trackEvent({
        eventType: 'button_click',
        buttonName: trackingName || props.name || 'unnamed_button',
        buttonText: typeof children === 'string' ? children : 'custom_content'
      });

      // Call the original onClick handler
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <button
        {...props}
        ref={ref}
        onClick={handleClick}
      >
        {children}
      </button>
    );
  });
};

// Tracked button component for easier usage
export const TrackedButton: React.FC<WithTrackingProps> = withTracking((props) => <button {...props} />); 