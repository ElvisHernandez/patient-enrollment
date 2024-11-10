import React from 'react';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="container py-2">
      <Outlet />
    </div>
  );
}
