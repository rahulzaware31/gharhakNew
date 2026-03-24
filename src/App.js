import React, { useState } from 'react';
import './index.css';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import WizardPage from './pages/WizardPage';
import DocGeneratorPage from './pages/DocGeneratorPage';
import IssuePage from './pages/IssuePage';
import ByeLawCheckerPage from './pages/ByeLawCheckerPage';
import PrePurchaseChecklistPage from './pages/PrePurchaseChecklistPage';
import ReraCheckerPage from './pages/ReraCheckerPage';
import ConveyanceCalculatorPage from './pages/ConveyanceCalculatorPage';
import Navbar from './components/Navbar';
import Ticker from './components/Ticker';
import Footer from './components/Footer';

export const AppContext = React.createContext();

export default function App() {
  const [page, setPage] = useState('home');
  const [selectedIssue, setSelectedIssue] = useState(null);

  const navigate = (p, data = null) => {
    setPage(p);
    if (data) setSelectedIssue(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      </main>
      <Footer navigate={navigate} />
    </AppContext.Provider>
  );
}
