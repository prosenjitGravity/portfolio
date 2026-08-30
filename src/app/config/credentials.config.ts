/**
 * Centralized Application Credentials & Public Configuration
 * 
 * IMPORTANT SECURITY PRACTICE FOR LIVE HOSTING:
 * - Never place raw private API keys, client secrets, or private database tokens here.
 * - For third-party OAuth (e.g. LinkedIn, GitHub, Email relays), route requests through
 *   a secure serverless backend / reverse proxy or environment variables.
 * - This file contains safe public identifiers and references.
 */

import { environment } from '../../environment/environment';

export interface AppCredentialsConfig {
  developer: {
    name: string;
    email: string;
    location: string;
    githubUsername: string;
    githubRepoUrl: string;
    linkedinProfileUrl: string;
  };
  apiEndpoints: {
    linkedinProfile: string;
    contactFormWebhook?: string;
  };
  features: {
    enableAnalytics: boolean;
    enableLiveCamera: boolean;
    enableTerminalSounds: boolean;
  };
}

export const APP_CREDENTIALS: AppCredentialsConfig = {
  developer: {
    name: 'Prosenjit Paul',
    email: 'paul.prosenjitbit@gmail.com',
    location: 'Kolkata, West Bengal, India',
    githubUsername: 'prosenjitGravity',
    githubRepoUrl: 'https://github.com/prosenjitGravity',
    linkedinProfileUrl: 'https://www.linkedin.com/in/prosenjit-paul-0a82b6239'
  },
  apiEndpoints: {
    linkedinProfile: environment.linkedinProfileApiUrl || '/api/linkedin/profile',
    // In production, you can set your serverless webhook endpoint (e.g. Formspree / EmailJS proxy)
    contactFormWebhook: undefined
  },
  features: {
    enableAnalytics: environment.production,
    enableLiveCamera: true,
    enableTerminalSounds: true
  }
};
