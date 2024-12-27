import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import type { Achievement } from '../types';

interface AchievementDetailsProps {
  achievement: Achievement & {
    category: { name: string };
    skills: Array<{ skill: { name: string } }>;
  };
}

export function AchievementDetails({ achievement }: AchievementDetailsProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="space-y-4">
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            {achievement.category.name}
          </span>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">{achievement.title}</h1>
        </div>

        {achievement.description && (
          <p className="text-gray-600">{achievement.description}</p>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {format(new Date(achievement.event_date), 'MMMM d, yyyy')}
          </div>
          {achievement.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {achievement.location}
            </div>
          )}
        </div>

        {achievement.skills.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {achievement.skills.map(({ skill }) => (
                <span
                  key={skill.name}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}