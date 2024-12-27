import React from 'react';
import { Paperclip } from 'lucide-react';
import type { Attachment } from '../types';

interface AttachmentListProps {
  attachments: Attachment[];
}

export function AttachmentList({ attachments }: AttachmentListProps) {
  if (attachments.length === 0) return null;

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Attachments</h2>
      <ul className="divide-y divide-gray-200">
        {attachments.map((attachment) => (
          <li key={attachment.id} className="py-3">
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
            >
              <Paperclip className="h-4 w-4 mr-2" />
              {attachment.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}