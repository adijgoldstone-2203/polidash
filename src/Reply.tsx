import React, { useState, useEffect } from 'react';
import { useLanguage } from './i18n';

interface Submission {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  category: string;
  problem: string;
  status: 'unread' | 'read';
}

const Reply: React.FC = () => {
  const { t, lang } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'fact-check',
    problem: ''
  });
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [viewMode, setViewMode] = useState<'form' | 'inbox'>('form');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Admin access & authentication state
  const [isAdminURL, setIsAdminURL] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('polidash_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const checkHash = () => {
      const isMatched = window.location.hash.includes('admin=true') || window.location.hash.includes('/admin');
      setIsAdminURL(isMatched);
      // Auto toggle back to form if they navigate away from admin path and are not admin
      if (!isMatched) {
        setViewMode('form');
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleAdminToggleClick = () => {
    if (viewMode === 'inbox') {
      setViewMode('form');
      return;
    }
    
    // Attempting to go to Inbox
    if (isAuthenticated) {
      setViewMode('inbox');
    } else {
      setAuthError('');
      setPasscode('');
      setShowAuthModal(true);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'polidash2026') {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('polidash_admin_auth', 'true');
      } catch {}
      setShowAuthModal(false);
      setViewMode('inbox');
      setAuthError('');
    } else {
      setAuthError(lang === 'he' ? 'סיסמה שגויה. נסה שוב.' : 'Incorrect passcode. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('polidash_admin_auth');
    } catch {}
    setViewMode('form');
  };

  // Load submissions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('polidash_inbox_submissions');
    if (saved) {
      try {
        setSubmissions(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse submissions', e);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    const newSubmission: Submission = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      name: formData.name,
      email: formData.email,
      category: formData.category,
      problem: formData.problem,
      status: 'unread'
    };

    const updated = [newSubmission, ...submissions];
    setSubmissions(updated);
    localStorage.setItem('polidash_inbox_submissions', JSON.stringify(updated));

    // Construct structured subject and body text for FormSubmit API and mailto fallback
    const categoryLabel = getCategoryLabel(formData.category);
    let subject = '';
    let body = '';

    if (lang === 'he') {
      subject = `בקשת תיקון PoliDash: ${categoryLabel}`;
      body = `בקשת תיקון - זכות תגובה PoliDash\n` +
             `==================================\n\n` +
             `שם השולח: ${formData.name}\n` +
             `אימייל השולח: ${formData.email}\n` +
             `קטגוריית בקשה: ${categoryLabel}\n\n` +
             `תיאור הבעיה / בקשת התיקון:\n` +
             `-----------------------------------\n` +
             `${formData.problem}\n\n` +
             `---\n` +
             `נשלח דרך פורטל המידע PoliDash בתאריך ${new Date().toLocaleDateString('he-IL')}`;
    } else {
      subject = `PoliDash Correction Request: ${categoryLabel}`;
      body = `PoliDash Right of Reply Submission\n` +
             `==================================\n\n` +
             `Sender Name: ${formData.name}\n` +
             `Sender Email: ${formData.email}\n` +
             `Category: ${categoryLabel}\n\n` +
             `Discrepancy / Correction Requested:\n` +
             `-----------------------------------\n` +
             `${formData.problem}\n\n` +
             `---\n` +
             `Submitted via PoliDash Integrity Portal on ${new Date().toLocaleDateString('en-US')}`;
    }

    // Attempt background email delivery via FormSubmit ajax endpoint
    fetch("https://formsubmit.co/ajax/polidash.am@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        category: categoryLabel,
        message: body,
        _subject: subject
      })
    })
    .then(res => res.json())
    .then(() => {
      setIsSending(false);
      setIsSubmitted(true);
    })
    .catch(err => {
      console.error("FormSubmit API request failed, using mailto fallback:", err);
      // Fallback: trigger default local mail client so request is not lost
      window.location.href = `mailto:polidash.am@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setIsSending(false);
      setIsSubmitted(true);
    });
    setFormData({
      name: '',
      email: '',
      category: 'fact-check',
      problem: ''
    });
  };

  const toggleStatus = (id: string) => {
    const updated = submissions.map(sub => {
      if (sub.id === id) {
        return { ...sub, status: (sub.status === 'unread' ? 'read' : 'unread') as 'unread' | 'read' };
      }
      return sub;
    });
    setSubmissions(updated);
    localStorage.setItem('polidash_inbox_submissions', JSON.stringify(updated));
  };

  const deleteSubmission = (id: string) => {
    const updated = submissions.filter(sub => sub.id !== id);
    setSubmissions(updated);
    localStorage.setItem('polidash_inbox_submissions', JSON.stringify(updated));
  };

  const clearAllSubmissions = () => {
    if (window.confirm(lang === 'he' ? 'האם אתה בטוח שברצונך למחוק את כל הבקשות?' : 'Are you sure you want to clear all submissions?')) {
      setSubmissions([]);
      localStorage.setItem('polidash_inbox_submissions', JSON.stringify([]));
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'fact-check': return t('reply.form.cat1');
      case 'missing-info': return t('reply.form.cat2');
      case 'source-request': return t('reply.form.cat3');
      case 'stance-correction': return t('reply.form.cat4');
      default: return t('reply.form.cat5');
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white p-12 rounded-2xl shadow-xl text-center border border-stone-200 animate-in zoom-in duration-300">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl text-green-600 font-bold">✓</span>
          </div>
          <h2 className="font-headline text-3xl font-bold text-primary mb-4">{t('reply.success.title')}</h2>
          <p className="text-slate-600 mb-8 leading-relaxed text-sm">
            {t('reply.success.desc')}
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => {
                setIsSubmitted(false);
                setViewMode('form');
              }}
              className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-secondary transition-all text-xs uppercase tracking-wider"
            >
              {lang === 'he' ? 'שלח בקשה נוספת' : 'Submit Another Request'}
            </button>
            <button 
              onClick={() => window.location.hash = '#/'}
              className="w-full py-3 bg-stone-100 text-slate-600 rounded-xl font-bold hover:bg-stone-200 transition-all text-xs uppercase tracking-wider"
            >
              {t('reply.success.back')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f5] px-6 lg:px-12 pt-8 pb-20" dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        
        {/* Toggle Admin/Form button */}
        {isAdminURL && (
          <div className="flex justify-end items-center gap-3 mb-6">
            {viewMode === 'inbox' && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-red-500 text-red-500 font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-red-50 transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                {lang === 'he' ? 'התנתק' : 'Logout'}
              </button>
            )}
            <button
              onClick={handleAdminToggleClick}
              className="px-4 py-2 border border-primary text-primary font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-stone-50/50 transition-all flex items-center gap-2 active:scale-95 shadow-sm cursor-pointer"
            >
              <span>{viewMode === 'form' ? '✉' : '✎'}</span>
              {viewMode === 'form' ? t('reply.inbox.toggleInbox') : t('reply.inbox.toggleForm')}
            </button>
          </div>
        )}

        {viewMode === 'form' ? (
          <>
            <header className="mb-12 text-start">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-3 block">{t('reply.subtitle')}</span>
              <h1 className="font-['Newsreader'] text-3xl sm:text-4xl md:text-7xl tracking-tight text-primary mb-4">
                {t('reply.title1')} <span className="italic font-bold">{t('reply.title2')}</span>
              </h1>
              <div className="h-1 w-24 bg-primary mb-6" />
              <p className="font-body text-lg text-slate-500 max-w-2xl leading-relaxed">
                {t('reply.desc')}
              </p>
            </header>

            <div className="max-w-3xl">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ms-1">{t('reply.form.name')}</label>
                    <input 
                      required
                      type="text" 
                      placeholder={t('reply.form.namePlaceholder')}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none text-xs"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ms-1">{t('reply.form.email')}</label>
                    <input 
                      required
                      type="email" 
                      placeholder={t('reply.form.emailPlaceholder')}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none text-xs"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mb-8 space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ms-1">{t('reply.form.category')}</label>
                  <div className="relative">
                    <select 
                      className={`w-full bg-stone-50 border border-stone-200 rounded-xl py-3 text-xs focus:ring-2 focus:ring-secondary focus:border-transparent cursor-pointer transition-all outline-none appearance-none bg-none ${
                        lang === 'he' ? 'pl-10 pr-4' : 'pr-10 pl-4'
                      }`}
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="fact-check">{t('reply.form.cat1')}</option>
                      <option value="missing-info">{t('reply.form.cat2')}</option>
                      <option value="source-request">{t('reply.form.cat3')}</option>
                      <option value="stance-correction">{t('reply.form.cat4')}</option>
                      <option value="other">{t('reply.form.cat5')}</option>
                    </select>
                    <div className={`absolute inset-y-0 flex items-center pointer-events-none text-slate-400 ${
                      lang === 'he' ? 'left-0 pl-3' : 'right-0 pr-3'
                    }`}>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="mb-10 space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ms-1">{t('reply.form.problem')}</label>
                  <textarea 
                    required
                    rows={6}
                    placeholder={t('reply.form.problemPlaceholder')}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none resize-none text-xs leading-relaxed"
                    value={formData.problem}
                    onChange={e => setFormData({...formData, problem: e.target.value})}
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={isSending}
                  className="w-full py-4 bg-primary text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-secondary shadow-lg shadow-primary/20 hover:shadow-secondary/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {lang === 'he' ? 'שולח...' : 'Sending...'}
                    </>
                  ) : (
                    t('reply.form.submit')
                  )}
                </button>
                
                <p className="text-center text-[9px] text-slate-400 mt-6 uppercase tracking-widest leading-relaxed">
                  {t('reply.form.disclaimer')}
                </p>
              </form>
            </div>
          </>
        ) : (
          <>
            <header className="mb-12 text-start">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-3 block">{t('reply.subtitle')}</span>
              <h1 className="font-['Newsreader'] text-3xl sm:text-4xl md:text-7xl tracking-tight text-primary mb-4">
                {t('reply.inbox.title')}
              </h1>
              <div className="h-1 w-24 bg-primary mb-6" />
              <p className="font-body text-lg text-slate-500 max-w-2xl leading-relaxed">
                {t('reply.inbox.desc')}
              </p>
            </header>

            <div className="max-w-3xl space-y-6">
              {/* Stats Dashcards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{t('reply.inbox.total')}</span>
                  <span className="text-2xl font-bold font-mono text-primary mt-1">{submissions.length}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{t('reply.inbox.unread')}</span>
                  <span className="text-2xl font-bold font-mono text-rose-600 mt-1">
                    {submissions.filter(s => s.status === 'unread').length}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{t('reply.inbox.resolved')}</span>
                  <span className="text-2xl font-bold font-mono text-emerald-600 mt-1">
                    {submissions.filter(s => s.status === 'read').length}
                  </span>
                </div>
              </div>

              {submissions.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center shadow-sm">
                  <p className="text-slate-400 italic text-sm">{t('reply.inbox.empty')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map(sub => {
                    const isUnread = sub.status === 'unread';
                    const formattedDate = new Date(sub.timestamp).toLocaleString(lang === 'he' ? 'he-IL' : 'en-US', {
                      dateStyle: 'short',
                      timeStyle: 'short'
                    });
                    return (
                      <div 
                        key={sub.id} 
                        className={`bg-white p-5 rounded-2xl border transition-all shadow-sm flex flex-col gap-3 ${
                          isUnread 
                            ? 'border-primary border-s-4 shadow-md' 
                            : 'border-stone-200 opacity-80'
                        }`}
                      >
                        {/* Header info */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-100 pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                              sub.category === 'fact-check' ? 'bg-amber-50 text-amber-700' :
                              sub.category === 'missing-info' ? 'bg-blue-50 text-blue-700' :
                              sub.category === 'stance-correction' ? 'bg-rose-50 text-rose-700' :
                              'bg-stone-50 text-slate-700'
                            }`}>
                              {getCategoryLabel(sub.category)}
                            </span>
                            {isUnread && (
                              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                          </div>
                          <span className="text-[9px] text-slate-400 font-mono">{formattedDate}</span>
                        </div>

                        {/* Content detail */}
                        <div className="space-y-1 mt-1">
                          <div className="flex flex-wrap items-center gap-2 text-[10px]">
                            <span className="text-slate-400 font-bold uppercase tracking-wider">{t('reply.inbox.sender')}:</span>
                            <span className="font-bold text-slate-700">{sub.name}</span>
                            <span className="text-slate-300">•</span>
                            <a href={`mailto:${sub.email}`} className="font-medium text-primary hover:underline">{sub.email}</a>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed bg-[#fbf9f5] p-4 rounded-xl border border-stone-200/40 mt-3 whitespace-pre-wrap">
                            {sub.problem}
                          </p>
                        </div>

                        {/* Actions block */}
                        <div className="flex justify-end gap-2 pt-2 border-t border-stone-100 mt-2">
                          <button
                            onClick={() => toggleStatus(sub.id)}
                            className={`px-3 py-1 rounded text-[9px] font-bold uppercase tracking-widest border transition-colors ${
                              isUnread 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' 
                                : 'bg-stone-50 text-slate-500 border-stone-100 hover:bg-stone-100'
                            }`}
                          >
                            {isUnread ? t('reply.inbox.markRead') : t('reply.inbox.markUnread')}
                          </button>
                          <button
                            onClick={() => deleteSubmission(sub.id)}
                            className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100 rounded text-[9px] font-bold uppercase tracking-widest transition-colors"
                          >
                            {t('reply.inbox.delete')}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Danger zone actions */}
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={clearAllSubmissions}
                      className="px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 font-bold text-xs uppercase tracking-widest rounded-lg transition-colors shadow-sm"
                    >
                      {t('reply.inbox.clearAll')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Passcode Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white/95 border border-stone-200 shadow-2xl rounded-2xl p-8 max-w-sm w-full mx-4 text-center animate-in zoom-in-95 duration-200" dir={lang === 'he' ? 'rtl' : 'ltr'}>
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-2xl">lock</span>
            </div>
            <h3 className="font-headline text-xl font-bold text-primary mb-2">
              {lang === 'he' ? 'גישת מנהל מערכת' : 'Administrator Portal'}
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              {lang === 'he' ? 'הזן את סיסמת מנהל המערכת על מנת לצפות בתיבת הבקשות' : 'Please enter the admin passcode to unlock and view unredacted submissions.'}
            </p>
            
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <input 
                  required
                  autoFocus
                  type="password"
                  placeholder={lang === 'he' ? 'הזן סיסמת מנהל...' : 'Enter admin passcode...'}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none text-center text-xs tracking-wider"
                  value={passcode}
                  onChange={e => {
                    setPasscode(e.target.value);
                    setAuthError('');
                  }}
                />
                {authError && (
                  <p className="text-[10px] font-bold text-rose-500 mt-1">{authError}</p>
                )}
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAuthModal(false);
                    setAuthError('');
                  }}
                  className="flex-1 py-2.5 bg-stone-100 text-slate-600 rounded-xl font-bold hover:bg-stone-200 transition-all text-[10px] uppercase tracking-wider cursor-pointer"
                >
                  {lang === 'he' ? 'ביטול' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-secondary transition-all text-[10px] uppercase tracking-wider cursor-pointer"
                >
                  {lang === 'he' ? 'התחבר' : 'Unlock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reply;
