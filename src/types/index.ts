export interface Child {
  id: string;
  parent_id: string;
  full_name: string;
  birth_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  child_id: string;
  category_id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  parent_category_id: string | null;
  is_custom: boolean;
  created_by: string | null;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  is_custom: boolean;
  created_by: string | null;
  created_at: string;
}

export interface Attachment {
  id: string;
  achievement_id: string;
  name: string;
  type: string;
  url: string;
  created_at: string;
}