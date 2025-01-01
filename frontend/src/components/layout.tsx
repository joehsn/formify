import { Outlet } from 'react-router-dom';
import Navbar from './navbar';

export default function Layout() {
  return (
    <div aria-label="layout">
      <Navbar />
      <Outlet />
    </div>
  );
}
