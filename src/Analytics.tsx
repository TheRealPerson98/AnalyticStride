import React, { useEffect } from 'react';

interface AnalyticsProps {
  // Optional callback for when analytics data is collected
  onCollect?: (data: AnalyticsData) => void;
  // Optional endpoint to send analytics data to
  endpoint?: string;
  // Optional API key for authentication
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

export const Analytics: React.FC<AnalyticsProps> = ({ 
  onCollect,
  endpoint = 'https://api.analyticstride.com/v1/collect',  // Cloud endpoint
  apiKey = 'public'  // Default public tier
}) => {
  useEffect(() => {
    const collectData = async () => {
      const data: AnalyticsData = {
        pathname: window.location.pathname,
        timestamp: Date.now(),
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        hostname: window.location.hostname
      };

      // Call the onCollect callback if provided
      if (onCollect) {
        onCollect(data);
      }

      try {
        // Send data to the endpoint
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          console.error('Failed to send analytics data');
        }
      } catch (error) {
        // Silently fail in production to not affect the user's app
        if (process.env.NODE_ENV !== 'production') {
          console.error('Error sending analytics data:', error);
        }
      }
    };

    // Collect data when component mounts
    collectData();

    // Set up page visibility change listener
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        collectData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onCollect, endpoint, apiKey]);

  // Component doesn't render anything
  return null;
}; 