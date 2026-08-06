import { requireRole } from '@/lib/core/session';
import React from 'react';

const CreatorLayout = async ({ children }) => {
    await requireRole('Creator');
    return children;
};

export default CreatorLayout;
