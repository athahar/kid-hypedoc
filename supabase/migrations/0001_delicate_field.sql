/*
  # Initial Achievement Tracker Schema

  1. New Tables
    - `profiles`
      - Parent profiles with authentication
    - `children`
      - Child profiles linked to parents
    - `achievements`
      - Achievement records with metadata
    - `categories`
      - Predefined and custom achievement categories
    - `skills`
      - Skills that can be tagged to achievements
    - `achievement_skills`
      - Junction table for achievement-skill relationships
    - `attachments`
      - Files and links attached to achievements

  2. Security
    - Enable RLS on all tables
    - Policies ensure parents can only access their own data
*/

-- Create tables
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES profiles(id) NOT NULL,
  full_name text NOT NULL,
  birth_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  parent_category_id uuid REFERENCES categories(id),
  is_custom boolean DEFAULT false,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) NOT NULL,
  category_id uuid REFERENCES categories(id),
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_by uuid REFERENCES profiles(id),
  is_custom boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE achievement_skills (
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (achievement_id, skill_id)
);

CREATE TABLE attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view own children"
  ON children FOR SELECT
  TO authenticated
  USING (parent_id = auth.uid());

CREATE POLICY "Users can manage own children"
  ON children FOR ALL
  TO authenticated
  USING (parent_id = auth.uid());

CREATE POLICY "Users can view categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create custom categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (is_custom = true AND created_by = auth.uid());

CREATE POLICY "Users can view achievements for own children"
  ON achievements FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM children
    WHERE children.id = achievements.child_id
    AND children.parent_id = auth.uid()
  ));

CREATE POLICY "Users can manage achievements for own children"
  ON achievements FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM children
    WHERE children.id = achievements.child_id
    AND children.parent_id = auth.uid()
  ));

CREATE POLICY "Users can view all skills"
  ON skills FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create custom skills"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (is_custom = true AND created_by = auth.uid());

CREATE POLICY "Users can view own achievement skills"
  ON achievement_skills FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM achievements a
    JOIN children c ON a.child_id = c.id
    WHERE achievement_skills.achievement_id = a.id
    AND c.parent_id = auth.uid()
  ));

CREATE POLICY "Users can manage own achievement skills"
  ON achievement_skills FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM achievements a
    JOIN children c ON a.child_id = c.id
    WHERE achievement_skills.achievement_id = a.id
    AND c.parent_id = auth.uid()
  ));

CREATE POLICY "Users can view own attachments"
  ON attachments FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM achievements a
    JOIN children c ON a.child_id = c.id
    WHERE attachments.achievement_id = a.id
    AND c.parent_id = auth.uid()
  ));

CREATE POLICY "Users can manage own attachments"
  ON attachments FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM achievements a
    JOIN children c ON a.child_id = c.id
    WHERE attachments.achievement_id = a.id
    AND c.parent_id = auth.uid()
  ));

-- Insert default categories
INSERT INTO categories (name, is_custom) VALUES
  ('Arts', false),
  ('STEM', false),
  ('Volunteering', false),
  ('Sports', false),
  ('Entrepreneurship', false),
  ('Leadership', false),
  ('Academic', false);

-- Insert default skills
INSERT INTO skills (name, is_custom) VALUES
  ('Leadership', false),
  ('Creativity', false),
  ('Problem Solving', false),
  ('Communication', false),
  ('Teamwork', false),
  ('Critical Thinking', false),
  ('Innovation', false),
  ('Time Management', false);