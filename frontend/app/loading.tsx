import DocNearLoader from '@/components/common/loader/DocNearLoader';

/**
 * Next.js App Router loading.tsx
 * Automatically shown while any page in the app is loading.
 * Placed at the root so it covers every route.
 */
export default function Loading() {
  return <DocNearLoader fullscreen />;
}
