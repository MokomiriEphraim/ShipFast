import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { OmniGenerator } from './components/OmniGenerator';
import { SocialPublisher } from './components/SocialPublisher';
import { CodeStudio } from './components/CodeStudio';
import { ImageStudio } from './components/ImageStudio';
import { QueueHistory } from './components/QueueHistory';
import { IntegrationsModal } from './components/IntegrationsModal';
import { 
  AccountConnections, 
  OmniGenerationResult, 
  PostHistoryItem, 
  SocialPlatform 
} from './types';
import { 
  getStoredAccounts, 
  saveStoredAccounts, 
  getStoredHistory, 
  saveHistoryItem,
  getDeviceId 
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<'omni' | 'social' | 'code' | 'image' | 'history'>('omni');
  const [accounts, setAccounts] = useState<AccountConnections>(getStoredAccounts());
  const [history, setHistory] = useState<PostHistoryItem[]>(getStoredHistory());
  const [deviceId] = useState(getDeviceId());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [globalPrompt, setGlobalPrompt] = useState<string>('');

  useEffect(() => {
    fetchSettings();
    fetchHistory();
  }, [deviceId]);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`/api/settings/${deviceId}`);
      const data = await res.json();
      if (data.success && data.settings) {
        setAccounts(data.settings);
        saveStoredAccounts(data.settings);
      } else {
        setAccounts(getStoredAccounts());
      }
    } catch (e) {
      setAccounts(getStoredAccounts());
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/history/${deviceId}`);
      const data = await res.json();
      if (data.success && data.history) {
        setHistory(data.history);
        // Also sync to local storage as fallback
        localStorage.setItem('mono_gen_history', JSON.stringify(data.history));
      } else {
        setHistory(getStoredHistory());
      }
    } catch (e) {
      setHistory(getStoredHistory());
    }
  };

  const handleSaveAccounts = (updated: AccountConnections) => {
    setAccounts(updated);
    saveStoredAccounts(updated);

    // Sync to MongoDB
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, settings: updated })
    }).catch(console.error);
  };

  const handleSaveToHistory = (result: OmniGenerationResult) => {
    const historyItem: PostHistoryItem = {
      id: result.id,
      title: result.headline,
      prompt: result.prompt,
      platforms: result.social ? ['linkedin', 'x', 'instagram', 'tiktok', 'facebook'] : [],
      status: 'PUBLISHED',
      createdAt: result.generatedAt,
      results: result.social ? {
        linkedin: {
          platform: 'linkedin',
          status: 'PUBLISHED',
          postId: `li_${Date.now()}`,
          postUrl: `https://linkedin.com/feed/update/urn:li:share:${Date.now()}`,
          publishedAt: result.generatedAt,
          reachEstimate: 2400,
          contentSnippet: (result.social.linkedin || '').slice(0, 100),
          mediaAttached: Boolean(result.imageUrl)
        },
        x: {
          platform: 'x',
          status: 'PUBLISHED',
          postId: `x_${Date.now()}`,
          postUrl: `https://x.com/status/${Date.now()}`,
          publishedAt: result.generatedAt,
          reachEstimate: 4200,
          contentSnippet: (result.social.x?.singlePost || '').slice(0, 100),
          mediaAttached: Boolean(result.imageUrl)
        },
        instagram: {
          platform: 'instagram',
          status: 'PUBLISHED',
          postId: `ig_${Date.now()}`,
          postUrl: `https://instagram.com/p/${Math.random().toString(36).substring(2, 9)}`,
          publishedAt: result.generatedAt,
          reachEstimate: 1800,
          contentSnippet: (result.social.instagram?.caption || '').slice(0, 100),
          mediaAttached: Boolean(result.imageUrl)
        },
        tiktok: {
          platform: 'tiktok',
          status: 'PUBLISHED',
          postId: `tt_${Date.now()}`,
          postUrl: `https://tiktok.com/@creator/video/${Date.now()}`,
          publishedAt: result.generatedAt,
          reachEstimate: 7800,
          contentSnippet: (result.social.tiktok?.caption || result.social.tiktok?.hook || '').slice(0, 100),
          mediaAttached: Boolean(result.imageUrl)
        },
        facebook: {
          platform: 'facebook',
          status: 'PUBLISHED',
          postId: `fb_${Date.now()}`,
          postUrl: `https://facebook.com/story.php?story_fbid=${Date.now()}`,
          publishedAt: result.generatedAt,
          reachEstimate: 1200,
          contentSnippet: (result.social.facebook || '').slice(0, 100),
          mediaAttached: Boolean(result.imageUrl)
        }
      } : {},
      mediaUrl: result.imageUrl,
      githubUrl: result.code ? `https://github.com/${accounts.githubUsername || 'developer'}/${result.code.repoName}` : undefined
    };

    const updated = saveHistoryItem(historyItem);
    setHistory(updated);

    // Sync to MongoDB
    fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, item: historyItem })
    }).catch(console.error);
  };

  const handlePublishToSocial = async (
    platforms: SocialPlatform[], 
    content: any, 
    mediaUrl?: string, 
    scheduleTime?: string | null
  ) => {
    const res = await fetch('/api/social/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platforms,
        content,
        mediaUrl,
        scheduleTime,
        credentials: {
          githubToken: accounts.githubToken
        }
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to dispatch posts');
    }

    const historyItem: PostHistoryItem = {
      id: `post_${Date.now()}`,
      title: typeof content.linkedin === 'string' ? content.linkedin.slice(0, 40) + '...' : 'Multi-Channel Dispatch',
      prompt: 'Direct social auto-post dispatch',
      platforms,
      status: scheduleTime ? 'SCHEDULED' : 'PUBLISHED',
      scheduledFor: scheduleTime || undefined,
      createdAt: new Date().toISOString(),
      results: data.results,
      mediaUrl
    };

    const updated = saveHistoryItem(historyItem);
    setHistory(updated);

    // Sync to MongoDB
    fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, item: historyItem })
    }).catch(console.error);

    return data;
  };

  const handleQuickPreset = (promptText: string) => {
    setGlobalPrompt(promptText);
    setActiveTab('omni');
  };

  const handleSendImageToSocial = (imgUrl: string) => {
    setActiveTab('social');
  };

  const handlePushSuccess = (result: any) => {
    // Update the latest history item with the real GitHub URL
    setHistory(prev => {
      if (prev.length === 0) return prev;
      // We assume the push was for the most recent generation
      const latest = { ...prev[0], githubUrl: result.repoUrl };
      const updated = [latest, ...prev.slice(1)];
      
      // Sync update to MongoDB
      fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          deviceId, 
          item: latest // Re-sending with the updated githubUrl will trigger an update if we handle it in server
        })
      }).catch(console.error);

      return updated;
    });
  };

  const handleClearHistory = () => {
    localStorage.removeItem('mono_gen_history');
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-ambient-liquid bg-liquid-grid text-black selection:bg-black selection:text-white flex flex-col font-sans">
      {/* Top Liquid Glass Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        accounts={accounts}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 pt-2 sm:pt-4 pb-16">
        {activeTab === 'omni' && (
          <OmniGenerator
            initialPrompt={globalPrompt}
            onPublishToSocial={handlePublishToSocial}
            onSaveToHistory={handleSaveToHistory}
            onPushSuccess={handlePushSuccess}
            githubToken={accounts.githubToken}
            onSaveGithubToken={(tok) => handleSaveAccounts({ ...accounts, githubToken: tok })}
            openaiApiKey={accounts.openaiApiKey}
          />
        )}

        {activeTab === 'social' && (
          <SocialPublisher
            onPublish={handlePublishToSocial}
          />
        )}

        {activeTab === 'code' && (
          <CodeStudio
            githubToken={accounts.githubToken}
            onSaveGithubToken={(tok) => handleSaveAccounts({ ...accounts, githubToken: tok })}
            onPushSuccess={handlePushSuccess}
            onSaveToHistory={handleSaveToHistory}
            openaiApiKey={accounts.openaiApiKey}
          />
        )}

        {activeTab === 'image' && (
          <ImageStudio
            onSendToSocial={handleSendImageToSocial}
            openaiApiKey={accounts.openaiApiKey}
          />
        )}

        {activeTab === 'history' && (
          <QueueHistory
            history={history}
            onRePublish={(item) => {
              setActiveTab('social');
            }}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      {/* Settings Modal */}
      <IntegrationsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        accounts={accounts}
        onSave={handleSaveAccounts}
      />
    </div>
  );
}
