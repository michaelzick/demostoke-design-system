// Figma API Types
export interface FigmaUser {
  id: string;
  email: string;
  handle: string;
  img_url: string;
}

export interface FigmaTeam {
  id: string;
  name: string;
}

export interface FigmaProject {
  id: string;
  name: string;
}

export interface FigmaFile {
  key: string;
  name: string;
  thumbnail_url: string;
  last_modified: string;
}

export interface FigmaComponent {
  key: string;
  file_key: string;
  node_id: string;
  thumbnail_url: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  containing_frame?: {
    name: string;
    node_id: string;
  };
}

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
}

export interface FigmaFileResponse {
  document: FigmaNode;
  components: Record<string, FigmaComponent>;
  schemaVersion: number;
  styles: Record<string, any>;
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
}

// Database Types
export interface FigmaConnection {
  id: string;
  user_id: string;
  access_token: string;
  user_info: FigmaUser;
  team_id?: string;
  created_at: string;
  updated_at: string;
}

export interface FigmaFileRecord {
  id: string;
  user_id: string;
  figma_file_id: string;
  name: string;
  url: string;
  last_sync?: string;
  component_count: number;
  sync_status: 'synced' | 'outdated' | 'not-synced' | 'error';
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface FigmaComponentRecord {
  id: string;
  figma_file_id: string;
  figma_component_id: string;
  figma_component_name: string;
  design_system_component_id?: string;
  mapping_status: 'mapped' | 'unmapped' | 'conflict';
  component_data?: any;
  created_at: string;
  updated_at: string;
}

// API Error Types
export interface FigmaError {
  status: number;
  err: string;
}