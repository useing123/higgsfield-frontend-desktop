import * as amplitude from '@amplitude/analytics-browser';

const AMPLITUDE_API_KEY = process.env.AMPLITUDE_API_KEY!;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Initialize Amplitude
export const initAmplitude = () => {
  if (!AMPLITUDE_API_KEY) {
    console.warn('Amplitude API key not found. Analytics will not be tracked.');
    return;
  }

  // Get or create device ID
  const deviceId = getOrCreateDeviceId();

  amplitude.init(AMPLITUDE_API_KEY, undefined, {
    deviceId,
    defaultTracking: {
      sessions: true,
      pageViews: false, // We'll track manually for more control
      formInteractions: false,
      fileDownloads: false,
    },
    minIdLength: 10,
  });

  console.log('Amplitude initialized with device ID:', deviceId);
};

// Generate or retrieve stable device ID
const getOrCreateDeviceId = (): string => {
  const storageKey = 'higgsfield_device_id';

  if (typeof window === 'undefined') return '';

  let deviceId = localStorage.getItem(storageKey);

  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(storageKey, deviceId);
  }

  return deviceId;
};

// Set user ID (call after authentication)
export const setUserId = (userId: string) => {
  amplitude.setUserId(userId);
};

// Set user properties
export const setUserProperties = (properties: Record<string, any>) => {
  const identifyEvent = new amplitude.Identify();

  Object.entries(properties).forEach(([key, value]) => {
    identifyEvent.set(key, value);
  });

  amplitude.identify(identifyEvent);
};

// Increment user property
export const incrementUserProperty = (property: string, value: number = 1) => {
  amplitude.identify(new amplitude.Identify().add(property, value));
};

export { amplitude };
