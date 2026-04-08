import React, { useState } from 'react';
import './index.css';
import { trackPage } from './analytics';
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

export default function App() {
  const [page, setPage] = useState('home');
  const [selectedIssue, setSelectedIssue] = useState(null);

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
