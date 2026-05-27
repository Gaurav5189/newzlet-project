import { useEffect } from 'react';

export default function CrmRedirect() {
  useEffect(() => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/admin/`;
  }, []);
  return null;
}
