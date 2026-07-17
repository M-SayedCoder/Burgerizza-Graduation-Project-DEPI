import React from 'react';

export const PLACEHOLDER_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="bold" font-size="16" fill="%23d1d5db">Burgerizza Meal</text></svg>`;

export const CATEGORY_PLACEHOLDER_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="bold" font-size="12" fill="%23d1d5db">Food</text></svg>`;

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  if (target.src !== PLACEHOLDER_IMAGE) {
    target.src = PLACEHOLDER_IMAGE;
  }
};

export const handleCategoryImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  if (target.src !== CATEGORY_PLACEHOLDER_IMAGE) {
    target.src = CATEGORY_PLACEHOLDER_IMAGE;
  }
};
