import { createContext, useContext, useEffect, useState } from 'react';
import { getSettings } from '../services/api';

const SettingsContext = createContext({
  settings: null,
  setSettings: () => {},
  loading: true,
  error: null,
});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await getSettings();
        if (active) {
          setSettings(data);
        }
      } catch (err) {
        console.error('Failed to load live settings', err);
        if (active) {
          setError(err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  // Dynamically update the favicon + apple-touch-icon whenever logoUrl changes
  useEffect(() => {
    const logoUrl = settings?.logoUrl;
    if (!logoUrl) return;

    // Update all favicon/icon link tags
    const selectors = [
      'link[rel="icon"]',
      'link[rel="apple-touch-icon"]',
    ];
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.setAttribute('href', logoUrl);
      });
    });
  }, [settings?.logoUrl]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings, loading, error }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);

