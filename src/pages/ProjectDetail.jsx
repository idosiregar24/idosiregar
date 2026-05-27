import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, ArrowLeft, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoomedImage, setZoomedImage] = useState(null); // Stores the currently zoomed image URL
  const [currentZoomIndex, setCurrentZoomIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProjectDetail();
  }, [id]);

  const fetchProjectDetail = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleZoom = (index) => {
    setCurrentZoomIndex(index);
    setZoomedImage(allImages[index]);
  };

  const closeZoom = () => {
    setZoomedImage(null);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    const newIndex = (currentZoomIndex + 1) % allImages.length;
    setCurrentZoomIndex(newIndex);
    setZoomedImage(allImages[newIndex]);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    const newIndex = (currentZoomIndex - 1 + allImages.length) % allImages.length;
    setCurrentZoomIndex(newIndex);
    setZoomedImage(allImages[newIndex]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-white/50" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-white mb-4">Project not found</h2>
        <button onClick={() => navigate('/')} className="btn-primary">Return Home</button>
      </div>
    );
  }

  const allImages = project.image_urls && project.image_urls.length > 0 
    ? project.image_urls 
    : (project.image_url ? [project.image_url] : []);

  return (
    <div className="min-h-screen bg-dark-950 text-foreground pb-20 pt-32">
      {/* Lightbox / Zoom Overlay */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center"
            onClick={closeZoom}
          >
            <button className="absolute top-6 right-6 p-3 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all" onClick={closeZoom}>
              <X className="w-6 h-6" />
            </button>
            
            {allImages.length > 1 && (
              <>
                <button className="absolute left-6 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all" onClick={prevImage}>
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button className="absolute right-6 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all" onClick={nextImage}>
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              src={zoomedImage} 
              alt="Zoomed" 
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl" 
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 max-w-5xl">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/#portfolio')}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-10 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Portfolio</span>
        </button>

        {/* Header */}
        <header className="mb-16">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-white tracking-widest uppercase">
              {project.category}
            </span>
            <span className="text-sm font-semibold text-white/50">{project.year}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-8">
            {project.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 border-y border-white/10 py-6">
            <div className="flex-1 min-w-[200px]">
              <span className="block text-[10px] font-bold text-white/40 mb-3 uppercase tracking-widest">Technologies</span>
              <div className="flex flex-wrap gap-2">
                {project.tech?.split(',').map(t => (
                  <span key={t.trim()} className="px-3 py-1 rounded border border-white/10 text-xs font-medium text-white/70">
                    {t.trim()}
                  </span>
                ))}
              </div>
            </div>
            {project.project_url && (
              <div className="shrink-0">
                <a 
                  href={project.project_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center gap-2 px-6 py-3"
                >
                  Live Preview <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Description */}
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <h3 className="text-lg font-bold text-white mb-4">About the Project</h3>
              <div className="text-white/60 leading-relaxed whitespace-pre-wrap font-medium">
                {project.description}
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="lg:col-span-8 space-y-8">
            {allImages.length === 0 ? (
              <div className="aspect-video bg-dark-900 border border-white/5 rounded-2xl flex items-center justify-center text-white/30">
                No images available
              </div>
            ) : (
              <div className="grid gap-6">
                {/* Primary Large Image */}
                <div 
                  className="w-full rounded-2xl overflow-hidden bg-dark-900 border border-white/5 cursor-zoom-in group"
                  onClick={() => handleZoom(0)}
                >
                  <img 
                    src={allImages[0]} 
                    alt={project.title} 
                    className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />
                </div>
                
                {/* Grid for remaining images */}
                {allImages.length > 1 && (
                  <div className="grid grid-cols-2 gap-6">
                    {allImages.slice(1).map((img, idx) => (
                      <div 
                        key={idx + 1}
                        className="w-full rounded-2xl overflow-hidden bg-dark-900 border border-white/5 cursor-zoom-in group aspect-square sm:aspect-video"
                        onClick={() => handleZoom(idx + 1)}
                      >
                        <img 
                          src={img} 
                          alt={`${project.title} screenshot ${idx + 2}`} 
                          className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
