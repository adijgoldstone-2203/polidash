import React, { useState } from 'react';
import Home from './Home';
import Profiles from './Profiles';
import ProfileDetail from './ProfileDetail';
import Issues from './Issues';
import Quiz from './Quiz';

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
    switch (currentPath) {
      case '#/profiles':
        return <Profiles />;
      case '#/issues':
        return <Issues />;
      case '#/quiz':
        return <Quiz />;
      case '#/':
      default:
        return <Home />;
    }
  };

  return renderCurrentPage();
}

export default App;
