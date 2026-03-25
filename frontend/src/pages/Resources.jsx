import { useState, useEffect } from "react";
import { api } from "../services/api";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Modal from "../components/Modal";

export default function Resources() {
    const [resources, setResources] = useState([]);
    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [selectedResource, setSelectedResource] = useState(null);

    const categories = ["All", "Anxiety", "Sleep", "Focus", "Stress", "General"];

    const fetchResources = async () => {
        setLoading(true);
        try {
            const res = await api.get("/resources");
            setResources(res.data);
        } catch (err) {
            console.error("Failed to fetch resources", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const filteredResources = filter === "All"
        ? resources
        : resources.filter((r) => r.category === filter);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-text-main">Supporting Resources</h1>
                <p className="text-text-body">Explore materials to help you navigate your academic and emotional well-being.</p>
            </div>

            <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === cat
                                ? "bg-primary text-white"
                                : "bg-surface text-text-body hover:bg-primary/10 hover:text-primary"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <p>Loading resources...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((res) => (
                        <Card key={res._id} className="flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <Badge variant="secondary">{res.category}</Badge>
                                <span className="text-xs text-text-muted italic">{res.type}</span>
                            </div>
                            <h3 className="text-lg font-bold text-text-main mb-2">{res.title}</h3>
                            <p className="text-sm text-text-body flex-1 mb-6">{res.description}</p>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    if (res.fullContent) {
                                        setSelectedResource(res);
                                    } else {
                                        window.open(res.link, "_blank");
                                    }
                                }}
                            >
                                {res.fullContent ? "Read Article" : "View Resource"}
                            </Button>
                        </Card>
                    ))}
                </div>
            )}

            {filteredResources.length === 0 && !loading && (
                <Card className="py-12 text-center text-text-muted">
                    No resources found for this category.
                </Card>
            )}

            <Modal
                isOpen={!!selectedResource}
                onClose={() => setSelectedResource(null)}
                title={selectedResource?.title}
            >
                {selectedResource?.fullContent && Array.isArray(selectedResource.fullContent) && (
                    <div className="space-y-6">
                        {selectedResource.fullContent.map((section, idx) => (
                            <section key={idx}>
                                <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
                                    {section.title}
                                </h4>
                                <p className="text-text-main leading-relaxed">
                                    {section.text}
                                </p>
                            </section>
                        ))}
                    </div>
                )}
            </Modal>
        </div>
    );
}
