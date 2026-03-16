import { useState } from "react";

export default function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getLocation = () =>
    new Promise((resolve, reject) => {
      setLoading(true);
      if (!navigator.geolocation) {
        const msg = "Geolocation not supported";
        setError(msg);
        setLoading(false);
        return reject(msg);
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          };
          setLocation(loc);
          setLoading(false);
          resolve(loc);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
          reject(err.message);
        }
      );
    });

  return { location, error, loading, getLocation };
}
