import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Key, Sparkles, Brain, ChevronDown, ChevronUp, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { NemotronService } from './NemotronService';
import { NvButton } from '../../components/ui/NvButton';
import { NvCard } from '../../components/ui/NvCard';

export const AiCoachDrawer = ({ isOpen, onClose, userState }) => {
  const [apiKey, setApiKey] = useState(() => NemotronService.getApiKey());
  const [isEditingKey, setIsEditingKey] = useState(!NemotronService.hasApiKey());
  const [tempKey, setTempKey] = useState(apiKey);
  
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${userState?.user?.name || 'Explorer'}! I am NEURO, your AI Brain Coach powered by **NVIDIA Nemotron 550B**.\n\nI can analyze your cognitive test scores, recommend targeted training games, and explain the neuroscience behind your memory, attention, and reasoning skills. What would you like to focus on today?`,
    },
  ]);
  
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentReasoning, setCurrentReasoning] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [showReasoning, setShowReasoning] = useState(true);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, currentContent, currentReasoning]);

  const handleSaveKey = () => {
    NemotronService.setApiKey(tempKey.trim());
    setApiKey(tempKey.trim());
    setIsEditingKey(false);
    setError(null);
  };

  const handleSend = (textToSend = input) => {
    const text = textToSend.trim();
    if (!text || isStreaming) return;

    if (!NemotronService.hasApiKey()) {
      setIsEditingKey(true);
      setError('Please enter your NVIDIA API key to chat with Nemotron AI.');
      return;
    }

    setError(null);
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setIsStreaming(true);
    setCurrentReasoning('');
    setCurrentContent('');

    // Format for API (last 10 turns max to stay within prompt bounds)
    const apiMessages = newMessages.map(m => ({
      role: m.role,
      content: m.content,
    })).slice(-10);

    abortControllerRef.current = NemotronService.streamChat({
      messages: apiMessages,
      userState,
      onReasoningChunk: (chunk) => {
        setCurrentReasoning((prev) => prev + chunk);
      },
      onContentChunk: (chunk) => {
        setCurrentContent((prev) => prev + chunk);
      },
      onDone: () => {
        setIsStreaming(false);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: currentContent || 'No content returned',
            reasoning: currentReasoning || null,
          },
        ]);
        setCurrentReasoning('');
        setCurrentContent('');
      },
      onError: (err) => {
        setIsStreaming(false);
        setError(err.message || 'Failed to connect to NVIDIA API');
        setCurrentReasoning('');
        setCurrentContent('');
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        display: 'flex',
        justifyContent: 'flex-end',
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
      }}
      className="animate-fade-in"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '450px',
          height: '100%',
          background: 'var(--bg-base)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-elevated)',
          borderLeft: '1px solid var(--border-light)',
        }}
      >
        {/* Drawer Header */}
        <header
          style={{
            padding: '16px 20px',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #76B900 0%, #1A1A1A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                boxShadow: '0 0 12px rgba(118, 185, 0, 0.4)',
              }}
            >
              <Brain size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                NEURO AI Coach
                <span style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(118, 185, 0, 0.15)', color: '#76B900', borderRadius: 'var(--radius-full)', fontWeight: '800' }}>
                  NVIDIA Nemotron 550B
                </span>
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Personalized Cognitive Intelligence</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setIsEditingKey(!isEditingKey)}
              style={{ padding: '8px', color: NemotronService.hasApiKey() ? 'var(--color-success)' : 'var(--color-warning)', background: 'none', border: 'none', cursor: 'pointer' }}
              title="Configure API Key"
            >
              <Key size={18} />
            </button>
            <button onClick={onClose} style={{ padding: '8px', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Key Config Banner */}
        {isEditingKey && (
          <div style={{ padding: '14px 20px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              NVIDIA API Key Config
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="password"
                placeholder="nvapi-..."
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-base)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                }}
              />
              <NvButton variant="primary" size="sm" onClick={handleSaveKey}>
                Save
              </NvButton>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>
              Key is stored locally in your browser. Get one at build.nvidia.com
            </span>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div style={{ padding: '10px 16px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {[
            '📊 Analyze my cognitive weak spots',
            '🎯 Suggest today\'s optimal workout',
            '🧠 Explain how Stroop task trains focus',
            '⚡ How to improve my reaction time?',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={isStreaming}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-pill)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-secondary)',
                fontSize: '11px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat History Container */}
        <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {error && (
            <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--color-error-bg)', color: 'var(--color-error)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-surface)',
                  color: msg.role === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                  border: msg.role === 'user' ? 'none' : '1px solid var(--border-light)',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {msg.content}
              </div>

              {/* Saved reasoning drop-down if available */}
              {msg.reasoning && (
                <details style={{ marginTop: '6px', fontSize: '11px', color: 'var(--text-tertiary)', maxWidth: '85%' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: '700' }}>💡 View NVIDIA Reasoning Thought Process</summary>
                  <div style={{ padding: '8px', background: 'var(--bg-pill)', borderRadius: 'var(--radius-md)', marginTop: '4px', fontStyle: 'italic' }}>
                    {msg.reasoning}
                  </div>
                </details>
              )}
            </div>
          ))}

          {/* Active Streaming Response */}
          {isStreaming && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              {/* Reasoning Block */}
              {currentReasoning && (
                <div style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(118, 185, 0, 0.08)', border: '1px solid rgba(118, 185, 0, 0.3)', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#76B900', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Sparkles size={12} /> Nemotron Ultra Thinking...
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontStyle: 'italic', maxHeight: '120px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                    {currentReasoning}
                  </div>
                </div>
              )}

              {/* Main Content Streaming */}
              {currentContent ? (
                <div style={{ maxWidth: '85%', padding: '12px 16px', borderRadius: '18px 18px 18px 4px', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', fontSize: '14px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {currentContent}
                </div>
              ) : (
                <div style={{ padding: '12px 16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                  <RefreshCw size={16} className="animate-spin" /> Consulting NVIDIA Nemotron...
                </div>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <footer style={{ padding: '14px 16px', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-light)' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{ display: 'flex', gap: '8px' }}
          >
            <input
              type="text"
              placeholder="Ask your AI coach anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isStreaming}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-base)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'var(--accent-primary)',
                color: '#FFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: !input.trim() || isStreaming ? 'not-allowed' : 'pointer',
                opacity: !input.trim() || isStreaming ? 0.5 : 1,
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};
