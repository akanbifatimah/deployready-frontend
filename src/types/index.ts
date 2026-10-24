export type FrameworkId = 'react' | 'nodejs' | 'python';

export interface ChecklistItem {
  id: string;
  task: string;
  description: string;
}

export interface TroubleshootingItem {
  error: string;
  cause: string;
  fix: string;
}

export interface EnvVariable {
  key: string;
  description: string;
  example: string;
  required: boolean;
  /** Secrets must be set in the platform dashboard, never committed. */
  secret: boolean;
}

export interface EnvVarConfig {
  rules: string[];
  variables: EnvVariable[];
}

export interface BuildConfig {
  runtime: string;
  installCommand: string;
  buildCommand: string | null;
  startCommand: string;
  /** Static output folder; null for server apps. */
  outputDirectory: string | null;
  port: number | null;
  notes: string[];
}

export interface FrameworkGuide {
  id: FrameworkId;
  title: string;
  description: string;
  checklist: ChecklistItem[];
  repoPrep: string[];
  envVars: EnvVarConfig;
  buildConfig: BuildConfig;
  troubleshooting: TroubleshootingItem[];
}

export interface DeploymentData {
  guides: FrameworkGuide[];
}

export interface UserAuth {
  email: string;
  isAuthenticated: boolean;
  token: string | null;
}
