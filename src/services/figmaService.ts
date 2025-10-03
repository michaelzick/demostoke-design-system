import { supabase } from '@/integrations/supabase/client';
import {
  FigmaUser,
  FigmaTeam,
  FigmaProject,
  FigmaFile,
  FigmaComponent,
  FigmaFileResponse,
  FigmaConnection,
  FigmaFileRecord,
  FigmaComponentRecord,
  FigmaError
} from '@/types/figma';

const FIGMA_API_BASE = 'https://api.figma.com/v1';

class FigmaService {
  private async makeRequest<T>(
    endpoint: string,
    accessToken: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${FIGMA_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData: FigmaError = await response.json();
      throw new Error(errorData.err || `Figma API error: ${response.status}`);
    }

    return response.json();
  }

  // Validate access token and get user info
  async validateToken(accessToken: string): Promise<FigmaUser> {
    return this.makeRequest<FigmaUser>('/me', accessToken);
  }

  // Get user's teams
  async getUserTeams(accessToken: string): Promise<FigmaTeam[]> {
    const response = await this.makeRequest<{ teams: FigmaTeam[] }>('/me', accessToken);
    return response.teams || [];
  }

  // Get team projects
  async getTeamProjects(accessToken: string, teamId: string): Promise<FigmaProject[]> {
    const response = await this.makeRequest<{ projects: FigmaProject[] }>(
      `/teams/${teamId}/projects`,
      accessToken
    );
    return response.projects || [];
  }

  // Get project files
  async getProjectFiles(accessToken: string, projectId: string): Promise<FigmaFile[]> {
    const response = await this.makeRequest<{ files: FigmaFile[] }>(
      `/projects/${projectId}/files`,
      accessToken
    );
    return response.files || [];
  }

  // Get file details
  async getFile(accessToken: string, fileKey: string): Promise<FigmaFileResponse> {
    return this.makeRequest<FigmaFileResponse>(`/files/${fileKey}`, accessToken);
  }

  // Get file components
  async getFileComponents(accessToken: string, fileKey: string): Promise<FigmaComponent[]> {
    const response = await this.makeRequest<{ meta: { components: FigmaComponent[] } }>(
      `/files/${fileKey}/components`,
      accessToken
    );
    return response.meta?.components || [];
  }

  // Database operations for Figma connections
  async saveConnection(accessToken: string, userInfo: FigmaUser, teamId?: string): Promise<FigmaConnection> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');

    // Use the encrypted storage function
    const { data: connectionId, error } = await supabase.rpc('store_figma_token_encrypted', {
      p_user_id: user.id,
      p_access_token: accessToken,
      p_user_info: userInfo as any,
      p_team_id: teamId || null,
    });

    if (error) throw error;

    // Fetch the connection record
    const { data: connection, error: fetchError } = await supabase
      .from('figma_connections')
      .select('*')
      .eq('id', connectionId)
      .single();

    if (fetchError) throw fetchError;

    return {
      ...connection,
      access_token: accessToken, // Include token in return for immediate use
      user_info: connection.user_info as unknown as FigmaUser,
    } as FigmaConnection;
  }

  async getConnection(): Promise<FigmaConnection | null> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return null;

    // Fetch connection metadata
    const { data, error } = await supabase
      .from('figma_connections')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;

    // Decrypt the access token using the secure function
    const { data: decryptedToken, error: decryptError } = await supabase.rpc('get_figma_token_decrypted', {
      p_user_id: user.id,
    });

    if (decryptError) throw decryptError;
    
    return {
      ...data,
      access_token: decryptedToken,
      user_info: data.user_info as unknown as FigmaUser,
    } as FigmaConnection;
  }

  async deleteConnection(): Promise<void> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');

    // Use the secure deletion function that also removes the vault secret
    const { error } = await supabase.rpc('delete_figma_token_encrypted', {
      p_user_id: user.id,
    });

    if (error) throw error;
  }

  async saveFile(
    figmaFileId: string,
    name: string,
    url: string,
    componentCount: number
  ): Promise<FigmaFileRecord> {
    const { data, error } = await supabase
      .from('figma_files')
      .upsert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        figma_file_id: figmaFileId,
        name,
        url,
        component_count: componentCount,
        sync_status: 'synced' as const,
        last_sync: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      sync_status: data.sync_status as 'synced' | 'outdated' | 'not-synced' | 'error'
    } as FigmaFileRecord;
  }

  async getFiles(): Promise<FigmaFileRecord[]> {
    const { data, error } = await supabase
      .from('figma_files')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(file => ({
      ...file,
      sync_status: file.sync_status as 'synced' | 'outdated' | 'not-synced' | 'error'
    })) as FigmaFileRecord[];
  }

  async updateFileStatus(
    fileId: string,
    status: 'synced' | 'outdated' | 'not-synced' | 'error',
    componentCount?: number
  ): Promise<void> {
    const updates: any = {
      sync_status: status,
      last_sync: new Date().toISOString(),
    };

    if (componentCount !== undefined) {
      updates.component_count = componentCount;
    }

    const { error } = await supabase
      .from('figma_files')
      .update(updates)
      .eq('id', fileId);

    if (error) throw error;
  }

  async deleteFile(fileId: string): Promise<void> {
    const { error } = await supabase
      .from('figma_files')
      .delete()
      .eq('id', fileId);

    if (error) throw error;
  }

  // Database operations for Figma components
  async saveComponents(
    figmaFileId: string,
    components: FigmaComponent[]
  ): Promise<FigmaComponentRecord[]> {
    const componentRecords = components.map(comp => ({
      figma_file_id: figmaFileId,
      figma_component_id: comp.key,
      figma_component_name: comp.name,
      component_data: comp as any, // Cast to any for JSON storage
    }));

    const { data, error } = await supabase
      .from('figma_components')
      .upsert(componentRecords)
      .select();

    if (error) throw error;
    return (data || []).map(comp => ({
      ...comp,
      mapping_status: comp.mapping_status as 'mapped' | 'unmapped' | 'conflict',
      component_data: comp.component_data as any
    })) as FigmaComponentRecord[];
  }

  async getComponents(figmaFileId: string): Promise<FigmaComponentRecord[]> {
    const { data, error } = await supabase
      .from('figma_components')
      .select('*')
      .eq('figma_file_id', figmaFileId)
      .order('figma_component_name');

    if (error) throw error;
    return (data || []).map(comp => ({
      ...comp,
      mapping_status: comp.mapping_status as 'mapped' | 'unmapped' | 'conflict',
      component_data: comp.component_data as any
    })) as FigmaComponentRecord[];
  }

  // High-level sync operations
  async syncFile(fileKey: string): Promise<void> {
    const connection = await this.getConnection();
    if (!connection) throw new Error('No Figma connection found');

    try {
      // Get file details
      const fileData = await this.getFile(connection.access_token, fileKey);
      
      // Get components
      const components = await this.getFileComponents(connection.access_token, fileKey);
      
      const fileRecord = await this.saveFile(
        fileKey,
        fileData.name,
        `https://www.figma.com/file/${fileKey}`,
        components.length
      );
      
      // Save components
      await this.saveComponents(fileRecord.id, components);
      
      // Update sync status
      await this.updateFileStatus(fileRecord.id, 'synced', components.length);
    } catch (error) {
      // Update error status if file exists
      const files = await this.getFiles();
      const existingFile = files.find(f => f.figma_file_id === fileKey);
      if (existingFile) {
        await this.updateFileStatus(existingFile.id, 'error');
      }
      throw error;
    }
  }

  async refreshUserFiles(): Promise<FigmaFileRecord[]> {
    const connection = await this.getConnection();
    if (!connection) throw new Error('No Figma connection found');

    try {
      const teams = await this.getUserTeams(connection.access_token);
      const allFiles: FigmaFile[] = [];

      // Get files from all teams
      for (const team of teams) {
        const projects = await this.getTeamProjects(connection.access_token, team.id);
        for (const project of projects) {
          const files = await this.getProjectFiles(connection.access_token, project.id);
          allFiles.push(...files);
        }
      }

      // Update database with discovered files
      for (const file of allFiles) {
        try {
          await this.saveFile(
            file.key,
            file.name,
            `https://www.figma.com/file/${file.key}`,
            0 // Will be updated on sync
          );
        } catch (error) {
          console.warn(`Failed to save file ${file.key}:`, error);
        }
      }

      return this.getFiles();
    } catch (error) {
      console.error('Failed to refresh user files:', error);
      throw error;
    }
  }
}

export const figmaService = new FigmaService();