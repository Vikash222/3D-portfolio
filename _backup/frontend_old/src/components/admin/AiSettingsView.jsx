import React, { useState, useEffect } from 'react';
import {
  Bot,
  Key,
  Save,
  CheckCircle,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  Zap,
} from 'lucide-react';
import {
  getAiSettings,
  updateAiSettings,
  testAiConnection,
} from '../../services/api';

export default function AiSettingsView() {
  const [formData, setFormData] = useState({
    gemini_api_key: '',
    ai_system_prompt: '',
    ai_welcome_message: '',
  });

  const [keyConfigured, setKeyConfigured] = useState(false);
  const [maskedKey, setMaskedKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [testResult, setTestResult] = useState(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await getAiSettings();
      const data = res.ai_settings || res;
      if (data) {
        setFormData({
          gemini_api_key: '', // kept blank for security unless user enters a new one
          ai_system_prompt: data.ai_system_prompt || '',
          ai_welcome_message: data.ai_welcome_message || '',
        });
        setKeyConfigured(!!(data.has_api_key || data.gemini_api_key_configured));
        setMaskedKey(data.gemini_api_key_masked || (data.has_api_key ? '••••••••••••••••••••' : ''));
      }
    } catch (err) {
      console.error('Failed to load AI settings:', err);
      setMessage({ text: 'Failed to load AI settings.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestConnection = async () => {
    try {
      setTesting(true);
      setTestResult(null);
      const res = await testAiConnection(formData.gemini_api_key);
      setTestResult({ success: true, message: res.message || 'Gemini API connection successful!' });
    } catch (err) {
      const errMsg =
        err.response?.data?.message || 'Connection test failed. Check API key validity or internet connection.';
      setTestResult({ success: false, message: errMsg });
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const payload = { ...formData };
      if (!payload.gemini_api_key.trim()) {
        delete payload.gemini_api_key; // keep existing key on server
      }

      await updateAiSettings(payload);
      setMessage({ text: 'AI Assistant settings updated successfully!', type: 'success' });
      loadSettings();
    } catch (err) {
      setMessage({ text: 'Failed to update AI settings.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-slate-500 text-sm">Loading AI settings...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-400" />
          Google Gemini AI Assistant Settings
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Configure Google Gemini API integration, tailor the AI persona prompt, customize knowledge grounding, and test connectivity.
        </p>
      </div>

      {message.text && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-sm ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Gemini API Key Box */}
        <div className="bg-[#0b101d] rounded-2xl p-7 border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-400" />
              Google Gemini API Key
            </h3>

            <div className="flex items-center gap-2">
              {keyConfigured ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Key Configured
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Using Internal AI Matcher
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Get your free API key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google AI Studio</a>. If no key is set, the assistant operates seamlessly using an offline internal knowledge-base fallback.
          </p>

          <div className="space-y-2">
            <label className="block text-xs font-mono text-slate-300">
              {keyConfigured ? 'UPDATE API KEY (LEAVE BLANK TO KEEP CURRENT)' : 'ENTER GEMINI API KEY'}
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                name="gemini_api_key"
                value={formData.gemini_api_key}
                onChange={handleChange}
                placeholder={keyConfigured ? maskedKey : 'AIzaSy...'}
                className="w-full px-4 py-2.5 pr-20 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              disabled={testing}
              onClick={handleTestConnection}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold border border-white/10 transition-colors cursor-pointer disabled:opacity-50"
            >
              {testing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Pinging Gemini API...
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Test Live Connection
                </>
              )}
            </button>

            {testResult && (
              <span
                className={`text-xs font-medium flex items-center gap-1.5 ${
                  testResult.success ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                {testResult.message}
              </span>
            )}
          </div>
        </div>

        {/* AI Greeting Message */}
        <div className="bg-[#0b101d] rounded-2xl p-7 border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            AI Avatar Welcome Greeting
          </h3>
          <p className="text-xs text-slate-400">
            This opening message displays immediately whenever a recruiter or visitor opens the "Chat with Vikash" drawer.
          </p>
          <textarea
            rows={2}
            name="ai_welcome_message"
            value={formData.ai_welcome_message}
            onChange={handleChange}
            placeholder="Hello! I am Vikash's AI Digital Twin. Ask me anything about his technical stack..."
            className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none resize-none"
          />
        </div>

        {/* System Prompt & Grounding Instructions */}
        <div className="bg-[#0b101d] rounded-2xl p-7 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-blue-400" />
              AI System Prompt & Grounding Knowledge
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">
              Auto-Injected with Live DB Projects & Skills
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Specify how Vikash's AI assistant should speak, highlight past projects, address salary or contract expectations, and represent your engineering credentials.
          </p>
          <textarea
            rows={6}
            name="ai_system_prompt"
            value={formData.ai_system_prompt}
            onChange={handleChange}
            placeholder="You are Vikash Kumar's official AI assistant..."
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white focus:border-blue-400 focus:outline-none font-mono"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving AI Settings...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save AI Configuration</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
