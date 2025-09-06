export interface ComponentPropsSchema {
  [key: string]: {
    type: string;
    options?: string[];
    default?: any;
    required?: boolean;
    description?: string;
  };
}

export interface DesignSystemComponent {
  id: string;
  name: string;
  description: string;
  category: string;
  component_code: string;
  props_schema: ComponentPropsSchema;
  tags: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published' | 'deprecated';
  is_public: boolean;
  version: string;
  figma_file_id?: string;
  stories?: any[];
}

export interface GenerateComponentRequest {
  componentName: string;
  prompt: string;
  userId: string;
}

export interface GenerateComponentResponse {
  success: boolean;
  component?: DesignSystemComponent;
  generatedData?: {
    component_code: string;
    props_schema: ComponentPropsSchema;
    description: string;
    category: string;
    tags: string[];
  };
  error?: string;
}