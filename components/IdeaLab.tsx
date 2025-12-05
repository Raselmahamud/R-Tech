import React, { useState } from 'react';
import { Note } from '../types';
import { generateBusinessInsight } from '../services/geminiService';
import { Sparkles, Plus, Trash2, Lightbulb, Send, Loader } from 'lucide-react';

const MOCK_NOTES: Note[] = [
  { id: '1', title: 'New App Feature', content: 'Dark mode toggle with system preference sync.', tags: ['UX', 'Feature'], createdAt: '2023-10-20' },
  { id: '2', title: 'Marketing Slogan', content: 'R Tech: Engineering the Future.', tags: ['Marketing'], createdAt: '2023-10-21' },
];

const IdeaLab: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [activeTab, setActiveTab] = useState<'NOTES' | 'AI'>('NOTES');
  
  // AI State
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const handleAskAI = async () => {
    if (!prompt.trim()) return;
    
    const newMsg = { role: 'user' as const, text: prompt };
    setConversation([...conversation, newMsg]);
    setLoading(true);
    setPrompt('');

    const aiResponse = await generateBusinessInsight(newMsg.text);
    
    setConversation(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Idea Lab & Notes</h2>
          <p className="text-slate-500">Store ideas or brainstorm with R Tech AI.</p>
        </div>
        <div className="flex bg-slate-200 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('NOTES')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'NOTES' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-600 hover:text-slate-800'}`}
          >
            Sticky Notes
          </button>
          <button 
            onClick={() => setActiveTab('AI')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'AI' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
          >
            <Sparkles size={16} /> AI Consultant
          </button>
        </div>
      </div>

      {activeTab === 'NOTES' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer h-64">
            <Plus size={48} className="mb-2" />
            <span className="font-medium">Create New Note</span>
          </div>
          {notes.map(note => (
            <div key={note.id} className="bg-yellow-100 p-6 rounded-xl shadow-sm relative group h-64 flex flex-col transform hover:-translate-y-1 transition-transform">
              <button 
                onClick={() => handleDeleteNote(note.id)}
                className="absolute top-4 right-4 text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
              >
                <Trash2 size={18} />
              </button>
              <h3 className="font-bold text-lg text-slate-800 mb-3">{note.title}</h3>
              <p className="text-slate-700 flex-1 whitespace-pre-wrap font-handwriting">{note.content}</p>
              <div className="flex gap-2 mt-4">
                {note.tags.map(tag => (
                  <span key={tag} className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-[600px] flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <Sparkles className="text-indigo-500" size={18} />
              R Tech AI Assistant
            </h3>
            <p className="text-xs text-slate-500">Powered by Gemini 2.5 Flash. Ask for marketing strategies, code reviews, or management tips.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {conversation.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                <Lightbulb size={64} className="mb-4 text-indigo-300" />
                <p>Start a conversation to get insights...</p>
              </div>
            )}
            {conversation.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-xl ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                }`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-4 rounded-xl rounded-bl-none shadow-sm flex items-center gap-2">
                  <Loader size={16} className="animate-spin text-indigo-500" />
                  <span className="text-sm text-slate-500">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-200 rounded-b-xl">
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                placeholder="Ask about improving employee efficiency..."
                className="w-full pl-4 pr-12 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                onClick={handleAskAI}
                disabled={loading || !prompt}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaLab;