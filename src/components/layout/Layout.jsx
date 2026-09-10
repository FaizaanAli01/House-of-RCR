import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import ToastContainer from '../common/ToastContainer';

/**
 * Root layout wrapper used by all public and protected routes.
 * Renders: Navbar → page content (via <Outlet>) → Footer → Toast notifications
 */
const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Layout;
