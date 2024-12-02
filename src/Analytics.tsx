'use client';

import React, { useEffect, useCallback } from 'react';

interface AnalyticsProps {
  onCollect?: (data: AnalyticsData) => void;
  endpoint?: string;
  apiKey?: string;
  debug?: boolean;
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

export const AnalyticsContext = React.createContext<{
  trackEvent: (eventData: Partial<AnalyticsData>) => Promise<void>;
}>({
  trackEvent: async () => {},
});

export const Analytics: React.FC<AnalyticsProps> = ({ 
  onCollect,
  endpoint = 'https://api.analyticstride.com',
  apiKey = 'public',
  debug = true
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

      if (debug) {
        console.log('Analytics Event:', {
          type: eventData.eventType || 'pageview',
          data
        });
      }

      if (onCollect) {
        onCollect(data);
      }

      const url = `${endpoint}/collect`;
      if (debug) {
        console.log('Sending to:', url);
        console.log('Request body:', JSON.stringify(data, null, 2));
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify(data),
        mode: 'cors',
        credentials: 'omit',
      });

      const responseText = await response.text();
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
      }

      if (debug) {
        try {
          const responseData = JSON.parse(responseText);
          console.log('Server Response:', responseData);
        } catch (e) {
          console.log('Raw Server Response:', responseText);
        }
      }
    } catch (error) {
      console.error('Analytics error:', error);
      if (debug) {
        console.error('Full error details:', {
          endpoint,
          eventData,
          error
        });
      }
    }
  }, [onCollect, endpoint, apiKey, debug]);

  useEffect(() => {
    if (debug) console.log('Analytics mounted, tracking pageview');
    trackEvent({ eventType: 'pageview' });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (debug) console.log('Page became visible, tracking pageview');
        trackEvent({ eventType: 'pageview' });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [trackEvent, debug]);

  return (
    <AnalyticsContext.Provider value={{ trackEvent }}>
      {debug && <div style={{ display: 'none' }}>Analytics Initialized</div>}
    </AnalyticsContext.Provider>
  );
};

export const withTracking = (WrappedButton: React.ComponentType<any>) => {
  return React.forwardRef<HTMLButtonElement, WithTrackingProps>(({ 
    trackingName,
    onClick,
    children,
    ...props 
  }, ref) => {
    const { trackEvent } = React.useContext(AnalyticsContext);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      console.log('Button clicked:', trackingName);
      
      const buttonText = typeof children === 'string' ? children : 'custom_content';
      console.log('Button details:', {
        eventType: 'button_click',
        buttonName: trackingName || props.name || 'unnamed_button',
        buttonText
      });

      // Track the button click
      await trackEvent({
        eventType: 'button_click',
        buttonName: trackingName || props.name || 'unnamed_button',
        buttonText
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

export const TrackedButton: React.FC<WithTrackingProps> = withTracking((props) => <button {...props} />); 