import React, { useState } from 'react';
import Home from './Home';
import Header from './Header';
import Profiles from './Profiles';
import ProfileDetail from './ProfileDetail';
import Issues from './Issues';
import Quiz from './Quiz';
import Reply from './Reply';
import CoalitionBuilder from './CoalitionBuilder';
import PollsDashboard from './PollsDashboard';
import Footer from './Footer';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');

  React.useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/');
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Determine which page to show for simple routing logic
  const isHome = currentPath === '#/' || currentPath === '#/transparency';
  const isProfiles = currentPath === '#/profiles';
  const isIssues = currentPath.startsWith('#/issues');
  const isCoalition = currentPath === '#/coalition';
  const isPolls = currentPath === '#/polls';
  const isQuiz = currentPath === '#/quiz';
  const isReply = currentPath.startsWith('#/reply');
  const isProfileDetail = currentPath.startsWith('#/profile/');

  return (
    <div className="min-h-screen bg-[#fbf9f5] dark:bg-[#162839] transition-colors duration-300 flex flex-col">
      <Header currentPath={currentPath} />
      
      <main className="flex-grow relative">
        {/* Persistent Tab Stack */}
        <div className={isHome ? 'block' : 'hidden'}>
          <Home currentPath={currentPath} />
        </div>
        
        <div className={isProfiles ? 'block' : 'hidden'}>
          <Profiles />
        </div>
        
        <div className={isIssues ? 'block' : 'hidden'}>
          <Issues />
        </div>

        <div className={isCoalition ? 'block' : 'hidden'}>
          <CoalitionBuilder />
        </div>

        <div className={isPolls ? 'block' : 'hidden'}>
          <PollsDashboard />
        </div>
        
        <div className={isQuiz ? 'block' : 'hidden'}>
          <Quiz />
        </div>
        
        <div className={isReply ? 'block' : 'hidden'}>
          <Reply />
        </div>

        {/* Dynamic Detail Page (Unmounted when not in use to handle ID changes) */}
        {isProfileDetail && (
          <ProfileDetail id={currentPath.replace('#/profile/', '')} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
// Triggering redeploy for favicon fix at Wed May  6 16:32:01 IDT 2026
