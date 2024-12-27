/*
  # Add sample achievements

  1. Changes
    - Add 4 sample achievements for testing
    - Add skill mappings for achievements
*/

-- Insert achievements
WITH achievement_inserts AS (
  INSERT INTO achievements (child_id, category_id, title, description, event_date, location)
  SELECT 
    c.id as child_id,
    cat.id as category_id,
    achievement_data.title,
    achievement_data.description,
    achievement_data.event_date::date,
    achievement_data.location
  FROM children c
  CROSS JOIN (
    SELECT id FROM categories WHERE name = 'STEM' LIMIT 1
  ) cat,
  (VALUES
    (
      'First Place in Science Fair',
      'Created an innovative project about renewable energy sources',
      '2024-02-15',
      'Central Elementary School'
    ),
    (
      'Robotics Competition Winner',
      'Led the team in building and programming a rescue robot',
      '2024-01-20',
      'City Convention Center'
    ),
    (
      'Math Olympics Gold Medal',
      'Achieved perfect score in advanced mathematics competition',
      '2024-03-01',
      'Regional Math Center'
    ),
    (
      'Coding Challenge Champion',
      'Developed a weather monitoring application using Python',
      '2024-02-28',
      'Tech Academy'
    )
  ) as achievement_data(title, description, event_date, location)
  WHERE c.full_name = 'aaa'
  RETURNING id as achievement_id
)
-- Add skill mappings
INSERT INTO achievement_skills (achievement_id, skill_id)
SELECT 
  a.achievement_id,
  s.id as skill_id
FROM achievement_inserts a
CROSS JOIN (
  SELECT id FROM skills WHERE name IN ('Problem Solving', 'Innovation', 'Critical Thinking')
) s;