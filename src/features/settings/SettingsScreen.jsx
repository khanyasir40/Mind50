import React from 'react';
import { Moon, Sun, Volume2, VolumeX, Eye, Shield, Download, Trash2, Info } from 'lucide-react';
import { NvCard } from '../../components/ui/NvCard';
import { NvButton } from '../../components/ui/NvButton';

export const SettingsScreen = ({
  settings,
  onUpdateSettings,
  onExportData,
  onResetData,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
          Settings & Accessibility
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Preferences, audio, motion options, and data privacy controls.
        </p>
      </div>

      {/* Preferences Group */}
      <NvCard padding="0px">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', fontWeight: '800', color: 'var(--text-primary)' }}>
          Appearance & Sound
        </div>

        {/* Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {settings.theme === 'dark' ? <Moon size={20} color="var(--accent-primary)" /> : <Sun size={20} color="#F59E0B" />}
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>Dark Theme</h4>
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Adjust interface contrast palette</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.theme === 'dark'}
            onChange={(e) => onUpdateSettings({ theme: e.target.checked ? 'dark' : 'light' })}
            style={{ width: '20px', height: '20px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
          />
        </div>

        {/* Sound Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {settings.sound ? <Volume2 size={20} color="var(--accent-primary)" /> : <VolumeX size={20} color="var(--text-tertiary)" />}
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>Sound Effects</h4>
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Auditory feedback during games</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.sound}
            onChange={(e) => onUpdateSettings({ sound: e.target.checked })}
            style={{ width: '20px', height: '20px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
          />
        </div>
      </NvCard>

      {/* Privacy & Data Management */}
      <NvCard padding="20px">
        <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '14px' }}>
          Data & Privacy Management
        </h4>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <NvButton variant="secondary" size="md" icon={Download} onClick={onExportData}>
            Export My Data (JSON)
          </NvButton>
          <NvButton variant="danger" size="md" icon={Trash2} onClick={onResetData}>
            Reset Progress Data
          </NvButton>
        </div>
      </NvCard>

      {/* Medical Safety & Compliance Notice */}
      <div style={{ padding: '16px', background: 'var(--bg-pill)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <Info size={20} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          <strong>Medical Safety Disclaimer:</strong> NeuroVault is a cognitive training and entertainment platform. It does not provide medical diagnoses, treatment, or clinical health assessments. Performance metrics reflect relative game performance only.
        </p>
      </div>
    </div>
  );
};
