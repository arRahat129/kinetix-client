import { requireRole } from '@/lib/core/session';
import React from 'react';

const SupporterLayout = async ({ children }) => {
    await requireRole('Supporter');
    return children;
};

export default SupporterLayout;
