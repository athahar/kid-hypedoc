import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Paperclip } from 'lucide-react';
import { format } from 'date-fns';

interface AchievementCardProps {
  achievement: any; // Will type this properly once we have the full achievement data structure
  categoryName: string;
  skills: string[];
  attachmentCount: number;
}

export function AchievementCard({ achievement, categoryName, skills, attachmentCount }: AchievementCardProps) {
  return (
    <Link
      to={`/achievement/${achievement.id}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {categoryName}
            </span>
            <h3 className="mt-2 text-lg font-semibold text-gray-900">{achievement.title}</h3>
          </div>
        </div>
        
        {achievement.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{achievement.description}</p>
        )}

        <div className="mt-4 flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {format(new Date(achievement.event_date), 'MMM d, yyyy')}
          </div>
          {achievement.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {achievement.location}
            </div>
          )}
          {attachmentCount > 0 && (
            <div className="flex items-center">
              <Paperclip className="h-4 w-4 mr-1" />
              {attachmentCount} {attachmentCount === 1 ? 'attachment' : 'attachments'}
            </div>
          )}
        </div>

        {skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}