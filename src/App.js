import React, { useState, useEffect } from 'react';
import './index.css';
import { trackPage } from './analytics';
import { getApiKey, saveApiKey } from './utils/apiKey';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import WizardPage from './pages/WizardPage';
import DocGeneratorPage from './pages/DocGeneratorPage';
import IssuePage from './pages/IssuePage';
import ByeLawCheckerPage from './pages/ByeLawCheckerPage';
import PrePurchaseChecklistPage from './pages/PrePurchaseChecklistPage';
import ReraCheckerPage from './pages/ReraCheckerPage';
import ConveyanceCalculatorPage from './pages/ConveyanceCalculatorPage';
import ChecklistPage from './pages/ChecklistPage';
import RealCasesPage from './pages/RealCasesPage';
import SocietyHandoverChecklistPage from './pages/SocietyHandoverChecklistPage';
import SocietyAwarenessPage from './pages/SocietyAwarenessPage';
import MaintenanceCalculatorPage from './pages/MaintenanceCalculatorPage';
import Navbar from './components/Navbar';
import Ticker from './components/Ticker';
import Footer from './components/Footer';
import FeedbackButton from './components/FeedbackButton';

export const AppContext = React.createContext();

function ApiKeyBanner({ onSaved }) {
  const [input, setInput] = useState('');
  const [visible, setVisible] = useState(true);

  const handleSave = () => {
    if (input.trim()) {
      saveApiKey(input.trim());
      setVisible(false);
      onSaved();
    }
  };

  if (!visible) return null;

  return (
    <div className="apikey-banner">
      <div className="apikey-banner-inner">
        <span className="apikey-banner-text">
          Enter your <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer">Groq API key</a> to enable AI features:
        </span>
        <input
          className="apikey-banner-input"
          type="password"
          placeholder="gsk_..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
        />
        <button className="apikey-banner-btn" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('home');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [hasApiKey, setHasApiKey] = useState(() => !!getApiKey());

  const PAGE_TITLES = {
    home: 'Home',
    chat: 'AI Legal Advisor',
    wizard: 'Complaint Wizard',
    docs: 'Document Generator',
    issue: 'Issue Detail',
    byelaw: 'Bye-Law Checker',
    checklist: 'Pre-Purchase Checklist',
    rera: 'RERA Checker',
    conveyance: 'Conveyance Calculator',
    possession: 'Possession Checklist',
    cases: 'Real Cases',
    handover: 'Society Handover Checklist',
    awareness: 'Society Awareness & Rights',
    maintenance: 'Maintenance Calculator',
  };

  const navigate = (p, data = null) => {
    setPage(p);
    if (data) setSelectedIssue(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const title = data?.title
      ? `Issue: ${data.title}`
      : (PAGE_TITLES[p] || p);
    trackPage(`/${p}`, title);
  };

  return (
    <AppContext.Provider value={{ navigate, selectedIssue, setSelectedIssue }}>
      {!hasApiKey && <ApiKeyBanner onSaved={() => setHasApiKey(true)} />}
      <Ticker />
      <Navbar currentPage={page} navigate={navigate} />
      <main>
        {page === 'home' && <HomePage navigate={navigate} />}
        {page === 'chat' && <ChatPage />}
        {page === 'wizard' && <WizardPage />}
        {page === 'docs' && <DocGeneratorPage />}
        {page === 'issue' && <IssuePage />}
        {page === 'byelaw' && <ByeLawCheckerPage />}
        {page === 'checklist' && <PrePurchaseChecklistPage />}
        {page === 'rera' && <ReraCheckerPage />}
        {page === 'conveyance' && <ConveyanceCalculatorPage />}
        {page === 'possession' && <ChecklistPage />}
        {page === 'cases'      && <RealCasesPage />}
        {page === 'handover'   && <SocietyHandoverChecklistPage />}
        {page === 'awareness'  && <SocietyAwarenessPage />}
        {page === 'maintenance' && <MaintenanceCalculatorPage />}
      </main>
      <Footer navigate={navigate} />
      <FeedbackButton />
    </AppContext.Provider>
  );
}
