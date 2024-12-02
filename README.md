# AnalyticStride

A simple, lightweight analytics tracking component for React applications. Just add the component and get instant analytics!

## Installation

```bash
npm install analyticstride
# or
yarn add analyticstride
```

## Usage

Simply add the Analytics component to your app:

### React

```jsx
import { Analytics } from 'analyticstride';

function App() {
  return (
    <div>
      <Analytics />
      {/* Your app content */}
    </div>
  );
}
```

### Next.js

```jsx
'use client'; // If using in a Server Component

import { Analytics } from 'analyticstride';

function App() {
  return (
    <div>
      <Analytics />
      {/* Your app content */}
    </div>
  );
}
```

That's it! Your analytics will be automatically collected and stored.

### Advanced Configuration (Optional)

You can customize the analytics tracking with props:

```jsx
<Analytics 
  endpoint="https://your-custom-server.com/analytics" // Use your own server
  apiKey="your-api-key" // For premium features
  onCollect={(data) => {
    // Optional callback when data is collected
    console.log('Analytics data:', data);
  }}
/>
```

## What's Collected

The component automatically collects and stores:
- Current page path
- Timestamp
- Referrer
- User agent
- Screen resolution
- Browser language
- Hostname

## Self Hosting (Optional)

By default, analytics data is stored in our cloud. If you prefer to self-host:

1. Clone the server repository
2. Follow the server setup instructions in the server directory
3. Update the endpoint in your Analytics component to point to your server

## View Your Analytics

Access your analytics dashboard at https://analyticstride.com/dashboard
(Sign up for an API key to access premium features)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

ISC 