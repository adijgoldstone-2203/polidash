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
import Privacy from './Privacy';
import Terms from './Terms';
import MethodologyModal from './components/MethodologyModal';
import { AccessibilityWidget } from './components/AccessibilityWidget';
import DisclaimerPopup from './components/DisclaimerPopup';
import { useLanguage } from './i18n';
import ElectionsMap from './ElectionsMap';
import RecentStatements from './RecentStatements';
import VotingGuide from './VotingGuide';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);
  const [hasDismissedDisclaimer, setHasDismissedDisclaimer] = useState<boolean>(false);
  const { t } = useLanguage();

  // Clear legacy storage keys on load so stale flags never block the popup
  React.useEffect(() => {
    try {
      localStorage.removeItem('polidash_disclaimer_accepted');
      sessionStorage.removeItem('polidash_disclaimer_accepted');
    } catch {}
  }, []);

  // Trigger disclaimer popup on first user action (click or scroll)
  React.useEffect(() => {
    if (hasDismissedDisclaimer) return;

    const handleUserAction = () => {
      setShowDisclaimer(true);
      removeListeners();
    };

    const removeListeners = () => {
      window.removeEventListener('scroll', handleUserAction, { capture: true } as any);
      document.removeEventListener('scroll', handleUserAction, { capture: true } as any);
      window.removeEventListener('wheel', handleUserAction, { capture: true } as any);
      window.removeEventListener('touchmove', handleUserAction, { capture: true } as any);
      window.removeEventListener('click', handleUserAction, { capture: true } as any);
      window.removeEventListener('pointerdown', handleUserAction, { capture: true } as any);
      window.removeEventListener('touchstart', handleUserAction, { capture: true } as any);
      window.removeEventListener('keydown', handleUserAction, { capture: true } as any);
    };

    window.addEventListener('scroll', handleUserAction, { passive: true, capture: true });
    document.addEventListener('scroll', handleUserAction, { passive: true, capture: true });
    window.addEventListener('wheel', handleUserAction, { passive: true, capture: true });
    window.addEventListener('touchmove', handleUserAction, { passive: true, capture: true });
    window.addEventListener('click', handleUserAction, { capture: true });
    window.addEventListener('pointerdown', handleUserAction, { capture: true });
    window.addEventListener('touchstart', handleUserAction, { passive: true, capture: true });
    window.addEventListener('keydown', handleUserAction, { capture: true });

    return () => {
      removeListeners();
    };
  }, [hasDismissedDisclaimer]);

  const handleDismissDisclaimer = () => {
    setShowDisclaimer(false);
    setHasDismissedDisclaimer(true);
  };

  React.useEffect(() => {
    const handleHashChange = () => {
      const path = window.location.hash || '#/';
      setCurrentPath(path);

      if (path === '#/methodology' || path.includes('#methodology')) {
        setTimeout(() => {
          document.getElementById('methodology')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (path.startsWith('#/polls?')) {
        // PollsDashboard will smoothly scroll to the selected party's chart
      } else {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isDev = import.meta.env.DEV;

  // Determine which page to show for simple routing logic
  const isProfiles = currentPath === '#/profiles';
  const isIssues = currentPath.startsWith('#/issues');
  const isCoalition = currentPath === '#/coalition';
  const isPolls = currentPath.startsWith('#/polls') || currentPath === '#/methodology';
  const isQuiz = currentPath === '#/quiz';
  const isReply = currentPath.startsWith('#/reply') || currentPath === '#/transparency';
  const isProfileDetail = currentPath.startsWith('#/profile/');
  const isPrivacy = currentPath === '#/privacy';
  const isTerms = currentPath === '#/terms' || currentPath === '#/disclaimers';
  const isMap = isDev && currentPath === '#/map';
  const isStatements = isDev && currentPath === '#/statements';
  const isVoting = isDev && currentPath === '#/voting';
  
  const isHome = currentPath === '#/' || (
    !isProfiles && !isIssues && !isCoalition && !isPolls && !isQuiz && 
    !isReply && !isProfileDetail && !isPrivacy && !isTerms && !isMap && !isStatements && 
    !isVoting
  );

  return (
    <div className="min-h-screen bg-[#fbf9f5] dark:bg-[#162839] transition-colors duration-300 flex flex-col">
      <a href="#main-content" className="a11y-skip-link">
        {t('a11y.skipLink')}
      </a>

      <Header currentPath={currentPath} />
      
      <main id="main-content" className="flex-grow relative">
        {/* Persistent Tab Stack */}
        <div className={isHome ? 'block' : 'hidden'}>
          <Home currentPath={currentPath} onShowMethodology={() => setShowMethodologyModal(true)} />
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
          <PollsDashboard currentPath={currentPath} />
        </div>
        
        <div className={isQuiz ? 'block' : 'hidden'}>
          <Quiz />
        </div>
        
        <div className={isReply ? 'block' : 'hidden'}>
          <Reply />
        </div>

        <div className={isPrivacy ? 'block' : 'hidden'}>
          <Privacy />
        </div>

        <div className={isTerms ? 'block' : 'hidden'}>
          <Terms />
        </div>

        <div className={isMap ? 'block' : 'hidden'}>
          <ElectionsMap />
        </div>

        <div className={isStatements ? 'block' : 'hidden'}>
          <RecentStatements />
        </div>

        <div className={isVoting ? 'block' : 'hidden'}>
          <VotingGuide />
        </div>

        {/* Dynamic Detail Page (Unmounted when not in use to handle ID changes) */}
        {isProfileDetail && (
          <ProfileDetail id={currentPath.replace('#/profile/', '')} />
        )}
      </main>

      <Footer onOpenDisclaimer={() => setShowDisclaimer(true)} />
      
      <MethodologyModal isOpen={showMethodologyModal} onClose={() => setShowMethodologyModal(false)} />

      <AccessibilityWidget />

      <DisclaimerPopup isOpen={showDisclaimer} onDismiss={handleDismissDisclaimer} />
    </div>
  );
}

export default App;
