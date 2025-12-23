import express from 'express';
import cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const app = express();
const PORT = process.env.PORT || 4201;

// Configuration
const CONFIG_PATH = path.join(os.homedir(), '.devpattern', 'config.json');
const DEFAULT_SEARCH_PATHS = [
  path.join(os.homedir(), 'Desktop', 'projects'),
  path.join(os.homedir(), 'Projects'),
  path.join(os.homedir(), 'Developer'),
  path.join(os.homedir(), 'repos'),
  process.cwd()
];

// Types
interface ProjectInfo {
  id: string;
  name: string;
  path: string;
  description?: string;
  techStack?: string[];
  lastModified: string;
  tracks: TrackInfo[];
}

interface TrackInfo {
  id: string;
  type: 'feature' | 'bug';
  title: string;
  status: 'planned' | 'in_progress' | 'completed';
  progress?: number;
}

interface Config {
  searchPaths: string[];
  projects: string[]; // Explicit project paths
}

// Helper Functions
function loadConfig(): Config {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Failed to load config:', e);
  }
  return { searchPaths: DEFAULT_SEARCH_PATHS, projects: [] };
}

function saveConfig(config: Config): void {
  try {
    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  } catch (e) {
    console.warn('Failed to save config:', e);
  }
}

function parseMarkdownFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match || !match[1]) return {};
  
  const frontmatter: Record<string, string> = {};
  const lines = match[1].split('\n');
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      frontmatter[key.trim()] = valueParts.join(':').trim();
    }
  }
  return frontmatter;
}

function discoverProjectInfo(projectPath: string): ProjectInfo | null {
  const conductorPath = path.join(projectPath, 'conductor');
  
  if (!fs.existsSync(conductorPath)) {
    return null;
  }

  const projectName = path.basename(projectPath);
  let description: string | undefined;
  let techStack: string[] = [];
  
  // Read product.md for description
  const productPath = path.join(conductorPath, 'product.md');
  if (fs.existsSync(productPath)) {
    try {
      const content = fs.readFileSync(productPath, 'utf-8');
      const lines = content.split('\n');
      // Find first paragraph after heading
      let foundHeading = false;
      for (const line of lines) {
        if (line.startsWith('#')) {
          foundHeading = true;
          continue;
        }
        if (foundHeading && line.trim() && !line.startsWith('#')) {
          description = line.trim().substring(0, 200);
          break;
        }
      }
    } catch (e) {
      // Ignore errors reading product.md
    }
  }

  // Read tech-stack.md for technologies
  const techStackPath = path.join(conductorPath, 'tech-stack.md');
  if (fs.existsSync(techStackPath)) {
    try {
      const content = fs.readFileSync(techStackPath, 'utf-8');
      // Extract tech names from markdown lists
      const matches = content.match(/^[-*]\s+\*\*(.+?)\*\*/gm);
      if (matches) {
        techStack = matches.map(m => m.replace(/^[-*]\s+\*\*(.+?)\*\*.*/, '$1')).slice(0, 5);
      }
    } catch (e) {
      // Ignore errors
    }
  }

  // Discover tracks
  const tracks: TrackInfo[] = [];
  const tracksDir = path.join(conductorPath, 'tracks');
  if (fs.existsSync(tracksDir)) {
    try {
      const trackDirs = fs.readdirSync(tracksDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);
      
      for (const trackDir of trackDirs) {
        const metadataPath = path.join(tracksDir, trackDir, 'metadata.json');
        if (fs.existsSync(metadataPath)) {
          try {
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
            tracks.push({
              id: trackDir,
              type: metadata.type || 'feature',
              title: metadata.title || trackDir.replace(/_/g, ' '),
              status: metadata.status || 'planned',
              progress: metadata.progress
            });
          } catch (e) {
            // Default track info if metadata parsing fails
            tracks.push({
              id: trackDir,
              type: 'feature',
              title: trackDir.replace(/_/g, ' '),
              status: 'planned'
            });
          }
        }
      }
    } catch (e) {
      // Ignore track discovery errors
    }
  }

  // Get last modified time
  let lastModified = new Date().toISOString();
  try {
    const stats = fs.statSync(conductorPath);
    lastModified = stats.mtime.toISOString();
  } catch (e) {
    // Ignore
  }

  return {
    id: Buffer.from(projectPath).toString('base64').replace(/[/+=]/g, '_'),
    name: projectName,
    path: projectPath,
    description,
    techStack,
    lastModified,
    tracks
  };
}

function discoverProjects(): ProjectInfo[] {
  const config = loadConfig();
  const discovered: Map<string, ProjectInfo> = new Map();

  // Check explicit project paths first
  for (const projectPath of config.projects) {
    if (fs.existsSync(projectPath)) {
      const info = discoverProjectInfo(projectPath);
      if (info) {
        discovered.set(projectPath, info);
      }
    }
  }

  // Scan search paths for projects
  for (const searchPath of config.searchPaths) {
    if (!fs.existsSync(searchPath)) continue;

    try {
      const entries = fs.readdirSync(searchPath, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        
        const projectPath = path.join(searchPath, entry.name);
        if (discovered.has(projectPath)) continue;

        const info = discoverProjectInfo(projectPath);
        if (info) {
          discovered.set(projectPath, info);
        }
      }
    } catch (e) {
      console.warn(`Failed to scan ${searchPath}:`, e);
    }
  }

  return Array.from(discovered.values()).sort((a, b) => 
    new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  );
}

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0'
  });
});

// Project discovery endpoints
app.get('/api/projects', (_req, res) => {
  try {
    const projects = discoverProjects();
    res.json({ projects, count: projects.length });
  } catch (e) {
    res.status(500).json({ error: 'Failed to discover projects', details: String(e) });
  }
});

app.get('/api/projects/:id', (req, res) => {
  try {
    const projects = discoverProjects();
    const project = projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (e) {
    res.status(500).json({ error: 'Failed to get project', details: String(e) });
  }
});

// Configuration endpoints
app.get('/api/config', (_req, res) => {
  res.json(loadConfig());
});

app.post('/api/config/search-paths', (req, res) => {
  const { path: newPath } = req.body;
  if (!newPath || typeof newPath !== 'string') {
    return res.status(400).json({ error: 'Path is required' });
  }
  
  const config = loadConfig();
  if (!config.searchPaths.includes(newPath)) {
    config.searchPaths.push(newPath);
    saveConfig(config);
  }
  res.json(config);
});

app.post('/api/config/projects', (req, res) => {
  const { path: projectPath } = req.body;
  if (!projectPath || typeof projectPath !== 'string') {
    return res.status(400).json({ error: 'Project path is required' });
  }
  
  const config = loadConfig();
  if (!config.projects.includes(projectPath)) {
    config.projects.push(projectPath);
    saveConfig(config);
  }
  res.json(config);
});

// Document endpoints (for reading markdown files)
app.get('/api/projects/:id/documents', (req, res) => {
  try {
    const projects = discoverProjects();
    const project = projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const conductorPath = path.join(project.path, 'conductor');
    const documents: Array<{ name: string; path: string; type: string }> = [];

    // Scan for markdown files
    const scanDir = (dir: string, basePath: string = '') => {
      if (!fs.existsSync(dir)) return;
      
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;
        
        if (entry.isDirectory()) {
          scanDir(path.join(dir, entry.name), relativePath);
        } else if (entry.name.endsWith('.md')) {
          documents.push({
            name: entry.name.replace('.md', ''),
            path: relativePath,
            type: basePath ? basePath.split('/')[0] : 'root'
          });
        }
      }
    };

    scanDir(conductorPath);
    res.json({ documents, projectPath: project.path });
  } catch (e) {
    res.status(500).json({ error: 'Failed to list documents', details: String(e) });
  }
});

app.get('/api/projects/:id/documents/*', (req, res) => {
  try {
    const projects = discoverProjects();
    const project = projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get the document path from the wildcard
    const docPath = req.params[0];
    const fullPath = path.join(project.path, 'conductor', docPath);

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    res.json({ content, path: docPath });
  } catch (e) {
    res.status(500).json({ error: 'Failed to read document', details: String(e) });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🎼 DevPattern Dashboard API running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   Projects API: http://localhost:${PORT}/api/projects`);
  
  // Log discovered projects on startup
  const projects = discoverProjects();
  console.log(`   Discovered ${projects.length} project(s)`);
  for (const p of projects) {
    console.log(`     - ${p.name} (${p.tracks.length} tracks)`);
  }
});

export { app };
