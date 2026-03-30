import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { 
  Search, 
  BookOpen, 
  ExternalLink, 
  Filter, 
  Info,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface ResourceSection {
  title: string;
  text: string;
}

interface Resource {
  _id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  link?: string;
  fullContent?: ResourceSection[];
}

export default function Resources() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [filter, setFilter] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

    const categories = ["All", "Anxiety", "Sleep", "Focus", "Stress", "General"];

    const fetchResources = async () => {
        setLoading(true);
        try {
            const res = await api.get("/reference");
            setResources(res.data || []);
        } catch (err) {
            console.error("Failed to fetch references", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const filteredResources = resources.filter((r) => {
        const matchesFilter = filter === "All" || r.category === filter;
        const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             r.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-10 animate-in fade-in duration-500 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-wider mb-4 shadow-sm">
                        <BookOpen className="w-3 h-3" /> Reference Intelligence
                    </div>
                    <h1 className="text-3xl font-black text-text-main uppercase tracking-tight">Support Library</h1>
                    <p className="text-text-body font-medium mt-2">Validated materials to optimize your academic and emotional performance metrics.</p>
                </div>
                
                <div className="relative group min-w-[280px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search resources..."
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface border border-border-light text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-inner"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap items-center gap-3 bg-canvas/50 p-2 rounded-[24px] border border-border-light shadow-inner">
                <div className="px-3 text-text-muted">
                    <Filter className="w-4 h-4" />
                </div>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === cat
                                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                                : "text-text-muted hover:text-text-main hover:bg-white"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {[1, 2, 3, 4, 5, 6].map(i => (
                         <div key={i} className="h-64 bg-surface rounded-3xl animate-pulse border border-border-light" />
                     ))}
                </div>
            ) : filteredResources.length === 0 ? (
                <Card className="py-24 text-center border-4 border-dashed border-border-light rounded-[32px] bg-canvas/30">
                    <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Search className="w-10 h-10 text-text-muted opacity-20" />
                    </div>
                    <h3 className="text-lg font-black text-text-main uppercase tracking-tight">No intelligence found</h3>
                    <p className="text-text-muted font-bold text-xs uppercase tracking-widest mt-1">Try adjusting your filters or search query</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                    {filteredResources.map((res) => (
                        <Card key={res._id} className="flex flex-col h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group border-border-light/50 overflow-hidden relative">
                            {res.fullContent && (
                                <div className="absolute top-0 right-0 p-3">
                                    <Sparkles className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            )}
                            
                            <div className="flex justify-between items-center mb-6">
                                <Badge variant="info" className="px-3 py-1 uppercase tracking-tighter text-[10px] font-black">{res.category}</Badge>
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-canvas rounded-lg border border-border-light text-[10px] uppercase font-black text-text-muted">
                                    {res.type}
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-text-main mb-3 tracking-tight group-hover:text-primary transition-colors leading-tight">
                                {res.title}
                            </h3>
                            
                            <p className="text-sm font-medium text-text-body flex-1 mb-8 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                                {res.description}
                            </p>

                            <Button
                                variant={res.fullContent ? "primary" : "outline"}
                                className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 group/btn"
                                onClick={() => {
                                    if (res.fullContent) {
                                        setSelectedResource(res);
                                    } else if (res.link) {
                                        window.open(res.link, "_blank");
                                    }
                                }}
                            >
                                {res.fullContent ? "Initialize Analysis" : "External Resource"}
                                {res.fullContent ? <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" /> : <ExternalLink className="w-3.5 h-3.5" />}
                            </Button>
                        </Card>
                    ))}
                </div>
            )}

            <Modal
                isOpen={!!selectedResource}
                onClose={() => setSelectedResource(null)}
                title={
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{selectedResource?.category} • Analysis</span>
                        <span className="text-2xl font-black text-text-main tracking-tighter uppercase">{selectedResource?.title}</span>
                    </div>
                }
            >
                {selectedResource?.fullContent && Array.isArray(selectedResource.fullContent) && (
                    <div className="space-y-10 py-4 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
                        {selectedResource.fullContent.map((section, idx) => (
                            <section key={idx} className="group/section">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-[10px] font-black text-primary group-hover/section:bg-primary group-hover/section:text-white transition-all shadow-sm">
                                        0{idx + 1}
                                    </div>
                                    <h4 className="text-xs font-black text-text-main uppercase tracking-[0.1em]">
                                        {section.title}
                                    </h4>
                                </div>
                                <div className="pl-11 relative">
                                    <div className="absolute left-3.5 top-0 bottom-0 w-[1px] bg-border-light group-hover/section:bg-primary/20 transition-colors" />
                                    <p className="text-text-body font-medium leading-relaxed text-sm">
                                        {section.text}
                                    </p>
                                </div>
                            </section>
                        ))}
                    </div>
                )}
                
                <div className="mt-8 pt-8 border-t border-border-light flex justify-between items-center">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                        AESP Reference Module RC-2024
                    </p>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedResource(null)} className="font-black uppercase tracking-widest text-[10px]">
                        Close Briefing
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
