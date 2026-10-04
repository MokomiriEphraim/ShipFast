export type SocialPlatform = 'linkedin' | 'x' | 'instagram' | 'tiktok' | 'facebook';

export interface SocialPostBundle {
  linkedin: string;
  x: {
    singlePost: string;
    thread: string[];
  };
  instagram: {
    caption: string;
    hashtags: string[];
    carouselSlides?: string[];
  };
  tiktok: {
    hook: string;
    script: string;
    caption: string;
  };
  facebook: string;
}

export interface CodeProjectBundle {
  repoName: string;
  fileName: string;
  language: string;
  code: string;
  previewHtml?: string;
  explanation: string;
  commitMessage: string;
  readme: string;
  files?: Array<{
    path: string;
    content: string;
  }>;
  dependencies?: string[];
}

export interface OmniGenerationResult {
  id: string;
  prompt: string;
  headline: string;
  summary: string;
  social: SocialPostBundle;
  code: CodeProjectBundle;
  imagePrompt: string;
  imageStyle?: string;
  imageAspectRatio?: string;
  imageUrl: string;
  tags: string[];
  generatedAt: string;
}

export interface GitHubPushResult {
  success: boolean;
  realGitHubPush: boolean;
  isSimulated?: boolean;
  repoUrl: string;
  gistUrl?: string;
  cloneUrl: string;
  owner: string;
  repoName: string;
  commitSha: string;
  committedFiles: string[];
  gitCommands?: string[];
  message: string;
}

export interface SocialPublishResult {
  platform: SocialPlatform;
  status: 'PUBLISHED' | 'SCHEDULED' | 'FAILED';
  postId: string;
  postUrl: string;
  publishedAt: string;
  reachEstimate: number;
  contentSnippet: string;
  mediaAttached: boolean;
}

export interface PostHistoryItem {
  id: string;
  title: string;
  prompt: string;
  platforms: SocialPlatform[];
  status: 'PUBLISHED' | 'SCHEDULED';
  scheduledFor?: string;
  createdAt: string;
  results: Record<string, SocialPublishResult>;
  mediaUrl?: string;
  githubUrl?: string;
}

export interface AccountConnections {
  githubToken: string;
  githubUsername: string;
  openaiApiKey: string;
  linkedinConnected: boolean;
  xConnected: boolean;
  instagramConnected: boolean;
  tiktokConnected: boolean;
  facebookConnected: boolean;
}
