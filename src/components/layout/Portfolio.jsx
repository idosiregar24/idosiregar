import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { supabase } from '../../lib/supabase';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = project.image_urls && project.image_urls.length > 0 
    ? project.image_urls 
    : (project.image_url ? [project.image_url] : []);

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-[85vw] md:w-auto shrink-0 snap-center group relative rounded-[2rem] apple-glass overflow-hidden flex flex-col hover:bg-white/[0.05] transition-colors cursor-pointer"
      onClick={() => navigate(`/project/${project.id}`)}
      data-project-title={project.title}
      data-project-tech={project.tech}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-white/5 border-b border-white/5">
        {images.length > 0 ? (
          <div className="relative w-full h-full group">
            <img 
              src={images[currentSlide]} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
            />
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 rounded-full transition-all ${idx === currentSlide ? 'w-4 bg-white' : 'w-1.5 bg-white/40'}`} 
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">No Image</div>
        )}
      </div>
      <div className="p-8 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-5">
           <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-white tracking-widest uppercase">{project.category}</span>
           <span className="text-xs text-white/40 font-semibold">{project.year}</span>
        </div>
        <h3 className="text-xl font-bold tracking-tight mb-3 text-white">{project.title}</h3>
        <p className="text-sm text-white/50 line-clamp-2 mb-8 flex-1 leading-relaxed">{project.description}</p>
        
        <button className="w-full apple-glass py-3 rounded-full text-sm font-semibold text-white transition-all group-hover:bg-white/10">
           View Details
        </button>
      </div>
    </motion.div>
  );
};

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const categories = ['All', ...new Set(projects.map(p => p.category))];
  if (categories.length === 1) categories.push('Web App', 'Mobile UI/UX', 'CMS');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filterProjects = (category) => {
    if (category === 'All') return projects;
    return projects.filter(p => p.category === category);
  };

  return (
    <section id="portfolio" className="py-32 bg-black relative border-t border-white/[0.05]">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Featured Projects</h2>
            <p className="text-white/50 text-lg">A collection of my academic and professional work.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-white/30" /></div>
        ) : (
          <TabGroup onChange={() => setCurrentPage(1)}>
            <TabList className="flex flex-wrap gap-2 mb-10 apple-glass p-2 rounded-full w-fit">
              {categories.map((cat) => (
                <Tab
                  key={cat}
                  className={({ selected }) =>
                    `px-5 py-2 rounded-full text-sm font-semibold transition-all outline-none cursor-pointer ${
                      selected
                        ? 'bg-white text-black shadow-sm'
                        : 'text-white/50 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  {cat}
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {categories.map((cat) => {
                const filtered = filterProjects(cat);
                const totalPages = Math.ceil(filtered.length / itemsPerPage);
                const startIndex = (currentPage - 1) * itemsPerPage;
                const currentProjects = filtered.slice(startIndex, startIndex + itemsPerPage);

                return (
                  <TabPanel key={cat} className="outline-none">
                    <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      <AnimatePresence mode='popLayout'>
                        {currentProjects.map((project) => (
                          <ProjectCard key={project.id} project={project} />
                        ))}
                      </AnimatePresence>
                    </div>

                    {totalPages > 1 && (
                      <div className="mt-16">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)) }}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                              />
                            </PaginationItem>
                            
                            {[...Array(totalPages)].map((_, i) => (
                              <PaginationItem key={i}>
                                <PaginationLink 
                                  onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1) }}
                                  isActive={currentPage === i + 1}
                                >
                                  {i + 1}
                                </PaginationLink>
                              </PaginationItem>
                            ))}

                            <PaginationItem>
                              <PaginationNext 
                                onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)) }}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </TabPanel>
                );
              })}
            </TabPanels>
          </TabGroup>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
