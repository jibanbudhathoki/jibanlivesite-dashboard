import React from 'react';
import { MessagesList } from '@/src/features/messages/components/MessagesList';

export function MessagesPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <MessagesList />
    </div>
  );
}
