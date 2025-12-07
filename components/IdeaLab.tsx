
import React, { useState } from 'react';
import { Note } from '../types';
import { generateBusinessInsight } from '../services/geminiService';
import { Sparkles, Plus, Trash2, Lightbulb, Send, Loader, X, PenTool, Tag, AlignLeft, Save, Palette, Wand2 } from 'lucide-react';

const MOCK_NOTES: Note[] = [
  { id: '1', title: 'New App Feature', content: 'Dark mode toggle with system preference sync.', tags: ['UX', 'Feature'], createdAt: '2023-10-20', color: 'yellow' },
  { id: '2', title: 'Marketing Slogan', content: 'R Tech: Engineering the Future.', tags: ['Marketing'], createdAt: '2023-10-21', color: 'blue' },
];

const NOTE_COLORS = [
  { id: 'yellow', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', hex: '#fefce8' },
  { id: 'blue', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', hex: '#eff6ff' },
  { id: 'green', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', hex: '#f0fdf4' },
  { id: 'purple', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', hex: '#faf5ff' },
  { id: 'red', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', hex: '#fef2f2' },
];

const IdeaLab: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [activeTab, setActiveTab] = useState<'NOTES' | 'AI'>('NOTES');
  
  // AI State
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: '', color: 'yellow' });
  const [isAiExpanding, setIsAiExpanding] = useState(false);

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const handleSaveNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString().split('T')[0],
      color: newNote.color
    };

    setNotes([note, ...notes]);
    setIsAddNoteModalOpen(false);
    setNewNote({ title: '', content: '', tags: '', color: 'yellow' });
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

  const handleAiExpand = async () => {
    if (!newNote.title && !newNote.content) return;
    setIsAiExpanding(true);
    const context = `Title: ${newNote.title}\nPartial Content: ${newNote.content}`;
    const prompt = "Expand on this idea with 2-3 bullet points of professional detail. Keep it concise.";
    const response = await generateBusinessInsight(prompt, context);
    
    setNewNote(prev => ({
      ...prev,
      content: prev.content + (prev.content ? '\n\n' : '') + response
    }));
    setIsAiExpanding(false);
  };

  const getNoteStyles = (colorId?: string) => {
    return NOTE_COLORS.find(c => c.id === colorId) || NOTE_COLORS[0];
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
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
          <div 
            onClick={() => setIsAddNoteModalOpen(true)}
            className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all cursor-pointer h-64 group"
          >
            <div className="bg-white p-4 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
               <Plus size={32} />
            </div>
            <span className="font-medium">Create New Note</span>
          </div>
          {notes.map(note => {
            const styles = getNoteStyles(note.color);
            return (
              <div key={note.id} className={`${styles.bg} border ${styles.border} p-6 rounded-xl shadow-sm relative group h-64 flex flex-col transform hover:-translate-y-1 transition-all hover:shadow-md`}>
                <button 
                  onClick={() => handleDeleteNote(note.id)}
                  className={`absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 ${styles.text.replace('800', '400')}`}
                >
                  <Trash2 size={18} />
                </button>
                <h3 className="font-bold text-lg text-slate-800 mb-3 line-clamp-1">{note.title}</h3>
                <div className="flex-1 overflow-hidden relative">
                   <p className="text-slate-700 whitespace-pre-wrap font-medium text-sm leading-relaxed font-handwriting">{note.content}</p>
                   <div className={`absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-${styles.bg.replace('bg-', '')} to-transparent`}></div>
                </div>
                <div className={`flex flex-wrap gap-2 mt-4 pt-3 border-t border-${styles.border.replace('border-', '')}/50`}>
                  {note.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-wider bg-white/50 text-slate-600 px-2 py-1 rounded-md font-bold">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
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

      {/* Redesigned Create Note Modal (Split View) */}
      {isAddNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden transform transition-all scale-100 flex flex-col md:flex-row h-[600px]">
             
             {/* LEFT SIDE: EDITOR */}
             <div className="w-full md:w-1/2 flex flex-col border-r border-slate-100 bg-white">
                <div className="px-8 py-6 border-b border-slate-50">
                   <h3 className="text-xl font-bold text-slate-800">Draft New Idea</h3>
                   <p className="text-sm text-slate-400">Capture your thoughts before they fly away.</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                   {/* Title Input */}
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Title</label>
                      <input 
                        autoFocus
                        type="text" 
                        placeholder="e.g. Project Phoenix" 
                        className="w-full text-lg font-bold text-slate-800 placeholder-slate-300 border-b-2 border-slate-100 focus:border-indigo-500 focus:outline-none py-2 transition-colors bg-transparent"
                        value={newNote.title}
                        onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                      />
                   </div>

                   {/* Content with AI */}
                   <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Details</label>
                        <button 
                          onClick={handleAiExpand}
                          disabled={isAiExpanding || (!newNote.title && !newNote.content)}
                          className="text-xs flex items-center gap-1.5 text-indigo-600 font-medium hover:bg-indigo-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
                        >
                          {isAiExpanding ? <Loader size={12} className="animate-spin"/> : <Wand2 size={12}/>}
                          AI Expand
                        </button>
                      </div>
                      <textarea 
                        className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                        placeholder="Describe your idea..."
                        value={newNote.content}
                        onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                      ></textarea>
                   </div>

                   {/* Tags */}
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tags</label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                          type="text" 
                          placeholder="Design, Marketing, Q4..." 
                          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          value={newNote.tags}
                          onChange={(e) => setNewNote({...newNote, tags: e.target.value})}
                        />
                      </div>
                   </div>

                   {/* Colors */}
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Color Code</label>
                      <div className="flex gap-3">
                        {NOTE_COLORS.map(c => (
                          <button
                            key={c.id}
                            onClick={() => setNewNote({...newNote, color: c.id})}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${c.bg} ${newNote.color === c.id ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
                          ></button>
                        ))}
                      </div>
                   </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-50 flex justify-between items-center bg-white">
                   <button onClick={() => setIsAddNoteModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm font-medium px-4">Cancel</button>
                   <button 
                     onClick={handleSaveNote}
                     disabled={!newNote.title || !newNote.content}
                     className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg shadow-slate-200 hover:bg-slate-800 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                   >
                     <Save size={16} /> Save Idea
                   </button>
                </div>
             </div>

             {/* RIGHT SIDE: PREVIEW */}
             <div className="hidden md:flex w-1/2 bg-slate-50/50 flex-col items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
                
                <div className="z-10 text-center mb-8">
                   <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Live Preview</h4>
                </div>

                {/* The Note Card */}
                <div className={`w-full max-w-sm aspect-square ${getNoteStyles(newNote.color).bg} border ${getNoteStyles(newNote.color).border} p-8 rounded-xl shadow-lg transform rotate-1 transition-all duration-300 relative flex flex-col`}>
                   <div className={`w-12 h-12 rounded-full bg-white/50 backdrop-blur absolute -top-4 -right-4 shadow-sm flex items-center justify-center ${getNoteStyles(newNote.color).text}`}>
                      <Sparkles size={20} />
                   </div>
                   
                   <h3 className="font-bold text-2xl text-slate-800 mb-4 break-words">{newNote.title || 'Your Title Here'}</h3>
                   
                   <div className="flex-1 overflow-hidden">
                     <p className="text-slate-700 font-medium text-base font-handwriting leading-relaxed whitespace-pre-wrap">
                        {newNote.content || 'Start typing to see your note content appear here...'}
                     </p>
                   </div>
                   
                   <div className="mt-6 pt-4 border-t border-black/5 flex flex-wrap gap-2">
                      {newNote.tags ? (
                        newNote.tags.split(',').filter(t => t.trim()).map((tag, i) => (
                          <span key={i} className="text-[10px] uppercase tracking-wider bg-white/60 text-slate-700 px-2 py-1 rounded-md font-bold shadow-sm">#{tag.trim()}</span>
                        ))
                      ) : (
                        <span className="text-[10px] uppercase tracking-wider bg-white/40 text-slate-400 px-2 py-1 rounded-md font-bold border border-dashed border-slate-300">#TAGS</span>
                      )}
                   </div>

                   <div className="absolute bottom-4 right-6 text-[10px] font-bold opacity-40 text-slate-800">
                      {new Date().toLocaleDateString()}
                   </div>
                </div>
             </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaLab;
