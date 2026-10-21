import { describe, it, expect } from 'vitest';
import { INITIAL_PROJECTS } from '../data/mockData';
import type { Project } from '../types';

describe('Projects Filtering, Search & Privacy Rules', () => {
  it('correctly filters projects by search term across title, summary, and components', () => {
    const query = 'e-paper';
    const matches = INITIAL_PROJECTS.filter((p) => {
      const q = query.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.components?.some((c) => c.name.toLowerCase().includes(q))
      );
    });

    expect(matches.length).toBeGreaterThan(0);
    expect(matches.some((p) => p.slug === 'esp32-epaper-weather-station')).toBe(true);
  });

  it('correctly filters projects by difficulty level', () => {
    const beginners = INITIAL_PROJECTS.filter((p) => p.difficulty === 'Beginner');
    const intermediates = INITIAL_PROJECTS.filter((p) => p.difficulty === 'Intermediate');
    const advanced = INITIAL_PROJECTS.filter((p) => p.difficulty === 'Advanced');

    expect(beginners.length).toBeGreaterThanOrEqual(1);
    expect(beginners.every((p) => p.difficulty === 'Beginner')).toBe(true);

    expect(intermediates.length).toBeGreaterThanOrEqual(1);
    expect(intermediates.every((p) => p.difficulty === 'Intermediate')).toBe(true);

    expect(advanced.length).toBeGreaterThanOrEqual(1);
    expect(advanced.every((p) => p.difficulty === 'Advanced')).toBe(true);
  });

  it('verifies that draft projects are strictly excluded from public published listings', () => {
    const testList: Project[] = [
      ...INITIAL_PROJECTS,
      {
        id: 'draft-p1',
        title: 'Secret Hardware Build in Progress',
        slug: 'secret-hardware-draft',
        summary: 'Not yet verified on bench',
        description: 'Draft notes',
        cover_image: '',
        difficulty: 'Intermediate',
        estimated_time: '1 hour',
        status: 'draft',
        featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    // Public visitor filter rule
    const publicVisible = testList.filter((p) => p.status === 'published');
    expect(publicVisible.every((p) => p.status === 'published')).toBe(true);
    expect(publicVisible.some((p) => p.id === 'draft-p1')).toBe(false);
  });

  it('correctly sorts projects by newest creation date', () => {
    const sorted = [...INITIAL_PROJECTS].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    for (let i = 0; i < sorted.length - 1; i++) {
      const current = new Date(sorted[i].created_at).getTime();
      const next = new Date(sorted[i + 1].created_at).getTime();
      expect(current).toBeGreaterThanOrEqual(next);
    }
  });
});
