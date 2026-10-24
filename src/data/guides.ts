import type { FrameworkGuide, FrameworkId } from '../types';
import data from './deploymentData.json';

export const FRAMEWORK_IDS: readonly FrameworkId[] = ['react', 'nodejs', 'python'];

export const isFrameworkId = (value: string): value is FrameworkId =>
  (FRAMEWORK_IDS as readonly string[]).includes(value);

// JSON imports widen `id` to string, so validate it once here.
export const guides: FrameworkGuide[] = data.guides.map((guide) => {
  if (!isFrameworkId(guide.id)) {
    throw new Error(`Unknown framework id "${guide.id}" in deploymentData.json`);
  }
  return { ...guide, id: guide.id };
});

export const getGuide = (id: FrameworkId) => guides.find((guide) => guide.id === id);
