import React, { useState } from 'react';
import Home from './Home';
import Header from './Header';
import Profiles from './Profiles';
import ProfileDetail from './ProfileDetail';
import Issues from './Issues';
import Quiz from './Quiz';
import Reply from './Reply';
import Footer from './Footer';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');

  React.useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderCurrentPage = () => {
    if (currentPath.startsWith('#/profile/')) {
      const id = currentPath.replace('#/profile/', '');
      return <ProfileDetail id={id} />;
    }
    if (currentPath.startsWith('#/issues')) {
      return <Issues />;
    }
    switch (currentPath) {
      case '#/profiles':
        return <Profiles />;
      case '#/quiz':
        return <Quiz />;
      case '#/reply':
        return <Reply />;
      case '#/transparency':
      case '#/':
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] dark:bg-[#162839] transition-colors duration-300">
      <Header currentPath={currentPath} />
      <div className="flex-grow">
        {renderCurrentPage()}
      </div>
      <Footer />
    </div>
  );
}

export default App;
