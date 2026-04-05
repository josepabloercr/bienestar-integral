import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Resource } from '../types';
import { cn } from '../lib/utils';

interface LibraryProps {
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
}

export default function Library({ resources, setResources }: LibraryProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newResource, setNewResource] = useState<Partial<Resource>>({
    type: 'video',
    category: 'ejercicio',
    title: '',
    url: ''
  });

  const addResource = () => {
    if (!newResource.title || !newResource.url) return;
    
    const resource: Resource = {
      id: Date.now().toString(),
      title: newResource.title!,
      url: newResource.url!,
      type: newResource.type as any,
      category: newResource.category as any,
      date: new Date().toISOString().split('T')[0]
    };
    
    setResources(prev => [resource, ...prev]);
    setShowAddModal(false);
    setNewResource({ type: 'video', category: 'ejercicio', title: '', url: '' });
  };

  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const renderPreview = (resource: Resource) => {
    if (resource.type === 'video') {
      const videoId = getYoutubeId(resource.url);
      if (videoId) {
        return (
          <iframe
            className="w-full aspect-video rounded-lg"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={resource.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        );
      }
    }
    
    if (resource.type === 'image') {
      return (
        <img 
          src={resource.url} 
          alt={resource.title} 
          className="w-full aspect-video object-cover rounded-lg"
          referrerPolicy="no-referrer"
        />
      );
    }

    return (
      <div className="w-full aspect-video bg-surface-container-highest rounded-lg flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-4xl text-primary/40 mb-2">link</span>
        <p className="text-sm font-medium truncate w-full">{resource.url}</p>
        <a 
          href={resource.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-4 text-xs font-bold text-secondary uppercase tracking-widest hover:underline"
        >
          Visitar Sitio
        </a>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-secondary font-bold tracking-[0.2em] text-xs uppercase mb-2 block">Tu Biblioteca Personal</span>
          <h2 className="text-3xl md:text-6xl font-extrabold tracking-tighter">Recursos y Guardados</h2>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-secondary text-on-secondary px-8 py-4 rounded-full font-bold text-sm shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          Nuevo Recurso
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {resources.length > 0 ? resources.map((resource) => (
            <motion.div
              key={resource.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-surface-container-low rounded-3xl p-6 border border-white/5 flex flex-col gap-4 group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2 inline-block",
                    resource.category === 'ejercicio' ? "bg-primary/10 text-primary" :
                    resource.category === 'comida' ? "bg-secondary/10 text-secondary" :
                    resource.category === 'recomendacion' ? "bg-tertiary/10 text-tertiary" :
                    "bg-on-surface-variant/10 text-on-surface-variant"
                  )}>
                    {resource.category}
                  </span>
                  <h3 className="text-lg font-bold line-clamp-1">{resource.title}</h3>
                </div>
                <button 
                  onClick={() => deleteResource(resource.id)}
                  className="p-2 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>

              {renderPreview(resource)}

              <div className="mt-auto flex justify-between items-center text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                <span>{resource.date}</span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">
                    {resource.type === 'video' ? 'play_circle' : resource.type === 'image' ? 'image' : 'link'}
                  </span>
                  <span>{resource.type}</span>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full py-20 text-center bg-surface-container-low rounded-3xl border border-dashed border-white/10">
              <span className="material-symbols-outlined text-6xl text-primary/20 mb-4">auto_stories</span>
              <p className="text-on-surface-variant">No tienes recursos guardados. ¡Añade videos, imágenes o enlaces!</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-surface-container-high rounded-3xl p-8 shadow-2xl border border-white/10"
            >
              <h3 className="text-2xl font-bold mb-6">Añadir Nuevo Recurso</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-1">Título</label>
                  <input 
                    className="w-full bg-surface-container-lowest border-none rounded-full px-6 py-4 text-on-surface focus:ring-2 focus:ring-secondary transition-all" 
                    placeholder="Ej: Rutina de Pierna, Receta de Ensalada..."
                    value={newResource.title}
                    onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-1">URL (YouTube, Imagen o Web)</label>
                  <input 
                    className="w-full bg-surface-container-lowest border-none rounded-full px-6 py-4 text-on-surface focus:ring-2 focus:ring-secondary transition-all" 
                    placeholder="https://..."
                    value={newResource.url}
                    onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-1">Tipo</label>
                    <select 
                      className="w-full bg-surface-container-lowest border-none rounded-full px-6 py-4 text-on-surface focus:ring-2 focus:ring-secondary appearance-none cursor-pointer"
                      value={newResource.type}
                      onChange={(e) => setNewResource(prev => ({ ...prev, type: e.target.value as any }))}
                    >
                      <option value="video">Video (YouTube)</option>
                      <option value="image">Imagen</option>
                      <option value="link">Enlace Web</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-1">Categoría</label>
                    <select 
                      className="w-full bg-surface-container-lowest border-none rounded-full px-6 py-4 text-on-surface focus:ring-2 focus:ring-secondary appearance-none cursor-pointer"
                      value={newResource.category}
                      onChange={(e) => setNewResource(prev => ({ ...prev, category: e.target.value as any }))}
                    >
                      <option value="ejercicio">Ejercicio</option>
                      <option value="comida">Comida</option>
                      <option value="recomendacion">Recomendación</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-8 py-4 rounded-full font-bold text-sm text-on-surface-variant hover:bg-white/5 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={addResource}
                    className="flex-1 bg-secondary text-on-secondary px-8 py-4 rounded-full font-bold text-sm shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
