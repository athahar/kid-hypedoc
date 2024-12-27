import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import type { Child } from '../types';
import { format } from 'date-fns';

interface ChildCardProps {
  child: Child;
}

export function ChildCard({ child }: ChildCardProps) {
  return (
    <Link
      to={`/child/${child.id}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-100 rounded-full p-3">
            <User className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{child.full_name}</h3>
            {child.birth_date && (
              <p className="text-sm text-gray-500">
                Born {format(new Date(child.birth_date), 'MMMM d, yyyy')}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}