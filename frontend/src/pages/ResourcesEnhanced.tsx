import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Modal from "../components/Modal";

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

const categories = ["All", "Anxiety", "Sleep", "Focus", "Stress", "General"];

export default function ResourcesEnhanced() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const response = await api.get("/reference");
        setResources(response.data || []);
      } catch (error) {
        console.error("Failed to fetch references", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesCategory = filter === "All" || resource.category === filter;
      const haystack = `${resource.title} ${resource.description} ${resource.category} ${resource.type}`.toLowerCase();
      const matchesQuery = haystack.includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [filter, query, resources]);

  const featuredResources = useMemo(() => filteredResources.slice(0, 3), [filteredResources]);

  const openResource = (resource: Resource) => {
    if (resource.fullContent) {
      setSelectedResource(resource);
      return;
    }

    if (resource.link) {
      window.open(resource.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="space-y-8">
      <section className="section-shell mesh-highlight overflow-hidden p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <Badge variant="secondary">Resource library</Badge>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">Support resources students can actually use.</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-text-body">
              Search across practical guidance for stress, sleep, focus, anxiety, and day-to-day emotional care. Open short reads when you need help fast, or explore deeper content when you have time.
            </p>
          </div>
          <Card className="border-none bg-white/85 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text-muted">Library overview</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-extrabold text-primary">{resources.length}</p>
                <p className="mt-1 text-sm text-text-body">Resources available</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-primary">{categories.length - 1}</p>
                <p className="mt-1 text-sm text-text-body">Core support categories</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[0.75fr_1.25fr]">
        <Card className="border-none bg-white/90">
          <h2 className="text-xl font-extrabold">Find the right kind of help</h2>
          <p className="mt-2 text-sm text-text-muted">Search by topic, then narrow by category.</p>

          <div className="mt-5 space-y-4">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search stress, sleep, focus, anxiety..."
              className="w-full rounded-full border border-border-light bg-surface px-4 py-3 text-sm text-text-main outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFilter(category)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === category ? "bg-primary text-white" : "bg-surface-strong text-text-body hover:bg-primary-light/40 hover:text-primary"}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="border-none bg-white/90">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold">Featured right now</h2>
              <p className="mt-1 text-sm text-text-muted">A quick starting point from your current filter.</p>
            </div>
            <Badge variant="primary">{filteredResources.length} matches</Badge>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {featuredResources.length === 0 && !loading ? (
              <div className="md:col-span-3 rounded-[26px] bg-surface-strong p-6 text-sm text-text-muted">
                No featured resources match your current search.
              </div>
            ) : (
              featuredResources.map((resource) => (
                <div key={resource._id} className="rounded-[26px] border border-border-light bg-surface-strong p-5">
                  <Badge variant="secondary">{resource.category}</Badge>
                  <h3 className="mt-4 text-lg font-bold text-text-main">{resource.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-text-body">{resource.description}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>

      <section>
        {loading ? (
          <Card className="border-none bg-white/90 py-12 text-center text-text-muted">
            Loading resources...
          </Card>
        ) : filteredResources.length === 0 ? (
          <Card className="border-none bg-white/90 py-12 text-center">
            <h2 className="text-2xl font-extrabold">No resources found</h2>
            <p className="mt-3 text-sm text-text-muted">Try a different search term or switch back to all categories.</p>
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredResources.map((resource) => (
              <Card key={resource._id} className="border-none bg-white/90">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <Badge variant="secondary">{resource.category}</Badge>
                    <h3 className="text-xl font-extrabold">{resource.title}</h3>
                  </div>
                  <span className="rounded-full bg-surface-strong px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
                    {resource.type}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-text-body">{resource.description}</p>
                <Button
                  variant="outline"
                  className="mt-6 w-full"
                  onClick={() => openResource(resource)}
                >
                  {resource.fullContent ? "Read article" : "Open resource"}
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Modal
        isOpen={Boolean(selectedResource)}
        onClose={() => setSelectedResource(null)}
        title={selectedResource?.title}
      >
        {selectedResource?.fullContent && Array.isArray(selectedResource.fullContent) && (
          <div className="space-y-6">
            {selectedResource.fullContent.map((section, index) => (
              <section key={`${section.title}-${index}`}>
                <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">{section.title}</h4>
                <p className="mt-3 text-sm leading-7 text-text-main">{section.text}</p>
              </section>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
