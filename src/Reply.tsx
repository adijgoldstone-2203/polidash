import React, { useState, useEffect } from 'react';

const Reply: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'fact-check',
    problem: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 p-12 rounded-2xl shadow-2xl text-center border border-stone-200 dark:border-slate-800 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
          </div>
          <h2 className="font-headline text-3xl font-bold text-primary mb-4">Message Received</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Thank you for your feedback. Our editorial team will review the information and update the database if necessary.
          </p>
          <button 
            onClick={() => window.location.hash = '#/'}
            className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-secondary transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-3 block">Integrity Matters</span>
          <h1 className="font-headline text-5xl font-black text-primary leading-tight mb-4">Right of Reply</h1>
          <p className="text-slate-600 max-w-xl mx-auto leading-relaxed">
            At PoliDash, we strive for absolute accuracy. Use this form to submit corrections, provide context, or report discrepancies in our politician profiles.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-stone-200 dark:border-slate-800 p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
              <input 
                required
                type="text" 
                placeholder="e.g. John Doe"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
              <input 
                required
                type="email" 
                placeholder="john@example.com"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="mb-8 space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Category of Review</label>
            <select 
              className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none appearance-none cursor-pointer"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="fact-check">Factual Inaccuracy</option>
              <option value="missing-info">Missing Context / Update Needed</option>
              <option value="source-request">Source Verification</option>
              <option value="stance-correction">Policy Stance Correction</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-10 space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">What is the problem you saw?</label>
            <textarea 
              required
              rows={6}
              placeholder="Please provide details about the specific profile, issue, or fact that needs review..."
              className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none resize-none"
              value={formData.problem}
              onChange={e => setFormData({...formData, problem: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-secondary shadow-lg shadow-primary/20 hover:shadow-secondary/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            Submit Review Request
            <span className="material-symbols-outlined">send</span>
          </button>
          
          <p className="text-center text-[10px] text-slate-400 mt-6 uppercase tracking-widest leading-relaxed">
            By submitting, you agree to our verification process. All reviews are cross-referenced with public voting records and official statements.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Reply;
