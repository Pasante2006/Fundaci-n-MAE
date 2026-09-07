import { Outlet } from 'react-router-dom';
import Header from '../../components/public/Header.jsx';
import Footer from '../../components/public/Footer.jsx';
import BackToTop from '../../components/public/BackToTop.jsx';

export default function PublicLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <BackToTop />
    </>
  );
}
