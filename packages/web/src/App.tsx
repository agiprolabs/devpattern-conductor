import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// API base URL
const API_BASE = '/api';

// Types matching the server
interface TrackInfo {
  id: string;
  type: 'feature' | 'bug';
  title: string;
  status: 'planned' | 'in_progress' | 'completed';
  progress?: number;
}

interface ProjectInfo {
  id: string;
  name: string;
  path: string;
  description?: string;
  techStack?: string[];
  lastModified: string;
  tracks: TrackInfo[];
}

// Reusable Layout component with header and navigation
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow flex-shrink-0">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img 
                src="/logo.png" 
                alt="DevPattern" 
                className="h-10 w-auto"
              />
              <h1 className="text-2xl font-bold text-gray-900">
                DevPattern
              </h1>
            </Link>
            <nav className="flex gap-6">
              <Link to="/projects" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Projects
              </Link>
              <Link to="/documents" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Documents
              </Link>
              <Link to="/tracks" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Tracks
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}

// Clickable card component
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  to: string;
}

function FeatureCard({ icon, title, description, to }: FeatureCardProps) {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate(to)}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer text-left w-full"
    >
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="font-medium text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </button>
  );
}

// Dashboard/Home page
function Dashboard() {
  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Welcome to DevPattern
            </h2>
            <p className="text-gray-500 mb-6">
              Your projects will appear here once connected.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <FeatureCard
                icon="📁"
                title="Projects"
                description="Discover & manage"
                to="/projects"
              />
              <FeatureCard
                icon="📝"
                title="Documents"
                description="View & edit markdown"
                to="/documents"
              />
              <FeatureCard
                icon="📊"
                title="Tracks"
                description="Monitor progress"
                to="/tracks"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const colors = {
    planned: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700'
  };
  const labels = {
    planned: 'Planned',
    in_progress: 'In Progress',
    completed: 'Completed'
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || colors.planned}`}>
      {labels[status as keyof typeof labels] || status}
    </span>
  );
}

// Project card component
function ProjectCard({ project, onClick }: { project: ProjectInfo; onClick: () => void }) {
  const trackStats = {
    total: project.tracks.length,
    inProgress: project.tracks.filter(t => t.status === 'in_progress').length,
    completed: project.tracks.filter(t => t.status === 'completed').length
  };

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-md hover:border-blue-200 transition-all w-full"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
        <span className="text-xs text-gray-400">
          {new Date(project.lastModified).toLocaleDateString()}
        </span>
      </div>
      
      {project.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
      )}
      
      {project.techStack && project.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {project.techStack.map((tech, i) => (
            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
              {tech}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex items-center gap-4 text-sm text-gray-500 border-t pt-3 mt-3">
        <span className="flex items-center gap-1">
          📊 {trackStats.total} track{trackStats.total !== 1 ? 's' : ''}
        </span>
        {trackStats.inProgress > 0 && (
          <span className="flex items-center gap-1 text-blue-600">
            🔄 {trackStats.inProgress} active
          </span>
        )}
        {trackStats.completed > 0 && (
          <span className="flex items-center gap-1 text-green-600">
            ✅ {trackStats.completed} done
          </span>
        )}
      </div>
      
      <p className="text-xs text-gray-400 mt-2 truncate" title={project.path}>
        📁 {project.path}
      </p>
    </button>
  );
}

// Projects page
function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/projects`)
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleProjectClick = (project: ProjectInfo) => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">📁 Projects</h2>
            <p className="text-gray-500 mt-1">Discover and manage your DevPattern projects</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            🔄 Refresh
          </button>
        </div>

        {loading && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-4xl mb-4 animate-pulse">🔍</div>
            <p className="text-gray-500">Scanning for projects...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-red-700 mb-2">Error Loading Projects</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Projects Found</h3>
              <p className="text-gray-500 mb-4">
                Projects with a <code className="bg-gray-100 px-2 py-1 rounded">conductor/</code> directory will appear here.
              </p>
              <p className="text-sm text-gray-400">
                Run <code className="bg-gray-100 px-2 py-1 rounded">devpattern_setup</code> in a project to get started.
              </p>
            </div>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

// Documents page
function DocumentsPage() {
  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">📝 Documents</h2>
          <p className="text-gray-500 mt-1">View and edit your project documentation</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Select a Project First</h3>
            <p className="text-gray-500">
              Choose a project from the <Link to="/projects" className="text-blue-600 hover:underline">Projects page</Link> to view its documentation.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Tracks page
function TracksPage() {
  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">📊 Tracks</h2>
          <p className="text-gray-500 mt-1">Monitor progress on features and bug fixes</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Active Tracks</h3>
            <p className="text-gray-500 mb-4">
              Tracks represent features or bugs you're working on.
            </p>
            <p className="text-sm text-gray-400">
              Use <code className="bg-gray-100 px-2 py-1 rounded">devpattern_newTrack</code> to create a new track.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Document info type
interface DocumentInfo {
  name: string;
  path: string;
  type: string;
}

// Project Detail Page
function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [docContent, setDocContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    
    // Fetch project details
    fetch(`${API_BASE}/projects/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Project not found');
        return res.json();
      })
      .then(data => {
        setProject(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });

    // Fetch documents
    fetch(`${API_BASE}/projects/${id}/documents`)
      .then(res => res.json())
      .then(data => {
        setDocuments(data.documents || []);
      })
      .catch(err => {
        console.error('Failed to load documents:', err);
      });
  }, [id]);

  const loadDocument = (docPath: string) => {
    setSelectedDoc(docPath);
    fetch(`${API_BASE}/projects/${id}/documents/${docPath}`)
      .then(res => res.json())
      .then(data => {
        setDocContent(data.content || '');
      })
      .catch(err => {
        setDocContent(`Error loading document: ${err.message}`);
      });
  };

  if (loading) {
    return (
      <Layout>
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-4xl mb-4 animate-pulse">📂</div>
            <p className="text-gray-500">Loading project...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-red-700 mb-2">Project Not Found</h3>
            <p className="text-red-600 mb-4">{error || 'The requested project could not be found.'}</p>
            <button
              onClick={() => navigate('/projects')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              ← Back to Projects
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Group documents by type
  const docsByType = documents.reduce((acc, doc) => {
    const type = doc.type || 'root';
    if (!acc[type]) acc[type] = [];
    acc[type].push(doc);
    return acc;
  }, {} as Record<string, DocumentInfo[]>);

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        {/* Breadcrumb */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/projects')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Projects
          </button>
        </div>

        {/* Project Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
              {project.description && (
                <p className="text-gray-600 mt-2">{project.description}</p>
              )}
              <p className="text-sm text-gray-400 mt-2">📁 {project.path}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last modified</p>
              <p className="text-sm font-medium">{new Date(project.lastModified).toLocaleDateString()}</p>
            </div>
          </div>
          
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              {project.techStack.map((tech, i) => (
                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documents Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-900 mb-4">📝 Documents</h3>
              
              {documents.length === 0 ? (
                <p className="text-sm text-gray-500">No documents found</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(docsByType).map(([type, docs]) => (
                    <div key={type}>
                      <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                        {type === 'root' ? 'Core' : type}
                      </h4>
                      <ul className="space-y-1">
                        {docs.map(doc => (
                          <li key={doc.path}>
                            <button
                              onClick={() => loadDocument(doc.path)}
                              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                selectedDoc === doc.path
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'hover:bg-gray-100 text-gray-700'
                              }`}
                            >
                              {doc.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tracks */}
            <div className="bg-white rounded-lg shadow p-4 mt-4">
              <h3 className="font-semibold text-gray-900 mb-4">📊 Tracks</h3>
              
              {project.tracks.length === 0 ? (
                <p className="text-sm text-gray-500">No active tracks</p>
              ) : (
                <ul className="space-y-2">
                  {project.tracks.map(track => (
                    <li key={track.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-900">{track.title}</span>
                          <p className="text-xs text-gray-500 mt-1">
                            {track.type === 'bug' ? '🐛' : '✨'} {track.type}
                          </p>
                        </div>
                        <StatusBadge status={track.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Document Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 min-h-[500px]">
              {!selectedDoc ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📄</div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Select a Document</h3>
                  <p className="text-gray-500">Choose a document from the sidebar to view its content.</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4 pb-4 border-b">
                    <h3 className="font-semibold text-gray-900">{selectedDoc}</h3>
                    <span className="text-xs text-gray-400">Markdown</span>
                  </div>
                  <div className="prose prose-sm max-w-none overflow-auto max-h-[600px] prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-800 prose-pre:text-gray-100">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {docContent}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:id" element={<ProjectDetailPage />} />
      <Route path="/documents" element={<DocumentsPage />} />
      <Route path="/tracks" element={<TracksPage />} />
    </Routes>
  );
}

export default App;
