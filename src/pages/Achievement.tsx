import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { getAchievement } from '../lib/api/achievements';
import { AchievementDetails } from '../components/AchievementDetails';
import { AttachmentList } from '../components/AttachmentList';

export function Achievement() {
  const { id } = useParams<{ id: string }>();
  const [achievement, setAchievement] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAchievement = async () => {
      if (!id) return;
      try {
        const data = await getAchievement(id);
        setAchievement(data);
      } catch (error) {
        console.error('Error loading achievement:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAchievement();
  }, [id]);

  if (isLoading || !achievement) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to={`/child/${achievement.child_id}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to profile
        </Link>
      </div>

      <div className="space-y-6">
        <AchievementDetails achievement={achievement} />
        <AttachmentList attachments={achievement.attachments || []} />
      </div>
    </div>
  );
}