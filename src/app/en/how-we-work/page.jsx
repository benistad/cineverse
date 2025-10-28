'use client';

import CommentNousTravaillonsContent from '@/components/pages/CommentNousTravaillonsContent';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

// English version - reuses French component with automatic translations
export default function HowWeWork() {
  return <CommentNousTravaillonsContent />;
}
