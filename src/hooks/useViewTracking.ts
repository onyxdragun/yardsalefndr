import { useEffect, useRef } from 'react';

// Hook to track views for garage sales
export const useViewTracking = (garageSaleId: number | null, enabled: boolean = true) => {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!garageSaleId || !enabled || hasTracked.current) {
      return;
    }

    const trackView = async () => {
      try {
        // Add a small delay to ensure the user actually viewed the content
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await fetch(`/api/garage-sales/${garageSaleId}/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          hasTracked.current = true;
        }
      } catch (error) {
        console.error('Failed to track view:', error);
        // Don't show error to user, view tracking is not critical
      }
    };

    trackView();
  }, [garageSaleId, enabled]);
};

export default useViewTracking;
