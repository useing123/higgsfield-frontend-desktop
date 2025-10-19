import ChatInterface from '@/components/lite/ChatInterface';
import { Suspense } from 'react';

export default function LitePage() {
  return (
    <div className='h-[calc(100vh-64px)]'>
      <Suspense>
        <ChatInterface />
      </Suspense>
    </div>
  );
}
