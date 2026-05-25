import { useState } from 'react';
import Header from './components/Header';
import BottomNavBar from './components/BottomNavBar';
import LiveScreen from './components/LiveScreen';
import TrendsScreen from './components/TrendsScreen';
import HistoryScreen from './components/HistoryScreen';
import ExportScreen from './components/ExportScreen';
import { INITIAL_SESSIONS, INITIAL_PLATFORMS } from './data';
import { TelemetrySession } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('export'); // Defaults to the export spec tab as shown in the request
  
  // App-wide unified database (local state)
  const [sessions, setSessions] = useState<TelemetrySession[]>(INITIAL_SESSIONS);
  const [platforms, setPlatforms] = useState(INITIAL_PLATFORMS);
  
  // Live session state
  const [isRecording, setIsRecording] = useState(false);
  const [activeAthlete, setActiveAthlete] = useState('Jade J. (Featherweight)');

  // Handlers
  const handleAddSession = (newSession: TelemetrySession) => {
    setSessions(prev => [newSession, ...prev]);
    setCurrentTab('history'); // auto navigation to backlog on save to review metrics
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const handleTogglePlatform = (id: string, newStatus: 'active' | 'linked' | 'offline') => {
    setPlatforms(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, status: newStatus };
      }
      return p;
    }));
  };

  return (
    <div className="bg-background text-on-surface min-h-[100dvh] pb-28 pt-20">
      <Header isRecording={isRecording} />

      <main id="app-content-container" className="pt-4 px-6 max-w-7xl mx-auto">
        {currentTab === 'live' && (
          <LiveScreen
            onAddSession={handleAddSession}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            activeAthlete={activeAthlete}
            setActiveAthlete={setActiveAthlete}
          />
        )}

        {currentTab === 'trends' && (
          <TrendsScreen />
        )}

        {currentTab === 'history' && (
          <HistoryScreen
            sessions={sessions}
            onDeleteSession={handleDeleteSession}
            onSelectSession={() => {}}
          />
        )}

        {currentTab === 'export' && (
          <ExportScreen
            sessions={sessions}
            platforms={platforms}
            onTogglePlatform={handleTogglePlatform}
            onNavigateToTab={setCurrentTab}
          />
        )}
      </main>

      <BottomNavBar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isRecording={isRecording}
      />
    </div>
  );
}
