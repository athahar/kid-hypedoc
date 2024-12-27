import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getCategories } from '../lib/api/categories';
import { getSkills } from '../lib/api/skills';
import type { Category, Skill } from '../types';

// Rest of the file remains the same...