import { useEffect, RefObject } from 'react';

/**
 * Hook that alerts when you click outside of the passed ref
 */
export function useClickOutside(
  ref: RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void,
  exceptRef?: RefObject<HTMLElement>,
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        ref.current && 
        !ref.current.contains(event.target as Node) && 
        (!exceptRef || (exceptRef && !exceptRef.current?.contains(event.target as Node)))
      ) {
        handler(event);
      }
    }

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    // Clean up event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref, handler, exceptRef]);
} 