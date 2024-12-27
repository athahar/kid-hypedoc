import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { getChild } from '../lib/api/children';
import { getAchievements } from '../lib/api/achievements';
import { AchievementCard } from '../components/AchievementCard';
import { AddAchievementModal } from '../components/AddAchievementModal';
import type { Child, Achievement } from '../types';

export function ChildProfile() {
  const { id } = useParams<{ id: string }>();
  const [child, setChild] = useState<Child | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const [childData, achievementsData] = await Promise.all([
          getChild(id),
          getAchievements(id)
        ]);
        setChild(childData);
        setAchievements(achievementsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleAddSuccess = async () => {
    if (!id) return;
    setShowAddModal(false);
    const achievementsData = await getAchievements(id);
    setAchievements(achievementsData);
  };

  if (isLoading || !child) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{child.full_name}'s Achievements</h1>
        {child.birth_date && (
          <p className="mt-1 text-sm text-gray-500">
            Born {new Date(child.birth_date).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Achievement
          </button>
        </div>
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No achievements yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding an achievement.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Achievement
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              categoryName={achievement.category?.name || 'Uncategorized'}
              skills={achievement.skills?.map((s) => s.skill.name) || []}
              attachmentCount={achievement.attachments?.length || 0}
            />
          ))}
        </div>
      )}

      {showAddModal && (
        <AddAchievementModal
          childId={id!}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}
    </div>
  );
}