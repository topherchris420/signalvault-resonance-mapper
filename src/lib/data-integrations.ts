export interface IntegrationConfig {
  platform: 'slack' | 'teams' | 'zoom' | 'google';
  apiKey?: string;
  webhookUrl?: string;
  accessToken?: string;
  refreshToken?: string;
  enabled: boolean;
}

export interface CommunicationMessage {
  id: string;
  platform: string;
  channel: string;
  text: string;
  timestamp: string;
  userId: string; // anonymized
  teamId: string;
  metadata: {
    messageType: 'chat' | 'email' | 'transcript';
    participants?: number;
    duration?: number;
    isThread?: boolean;
  };
}

export class DataIntegrationManager {
  private configs: Map<string, IntegrationConfig> = new Map();

  constructor() {
    this.loadConfigurations();
  }

  private loadConfigurations() {
    const stored = localStorage.getItem('signalvault_integrations');
    if (stored) {
      const configs = JSON.parse(stored);
      Object.entries(configs).forEach(([platform, config]) => {
        this.configs.set(platform, config as IntegrationConfig);
      });
    }
  }

  private saveConfigurations() {
    const configObj = Object.fromEntries(this.configs);
    localStorage.setItem('signalvault_integrations', JSON.stringify(configObj));
  }

  setIntegrationConfig(platform: string, config: IntegrationConfig) {
    this.configs.set(platform, config);
    this.saveConfigurations();
  }

  getIntegrationConfig(platform: string): IntegrationConfig | null {
    return this.configs.get(platform) || null;
  }

  async testConnection(platform: string): Promise<boolean> {
    const config = this.configs.get(platform);
    if (!config || !config.enabled) return false;

    try {
      switch (platform) {
        case 'slack':
          return await this.testSlackConnection(config);
        case 'teams':
          return await this.testTeamsConnection(config);
        case 'google':
          return await this.testGoogleConnection(config);
        case 'zoom':
          return await this.testZoomConnection(config);
        default:
          return false;
      }
    } catch (error) {
      console.error(`Connection test failed for ${platform}:`, error);
      return false;
    }
  }

  private async testSlackConnection(config: IntegrationConfig): Promise<boolean> {
    if (!config.accessToken) return false;

    const response = await fetch('https://slack.com/api/auth.test', {
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return data.ok;
  }

  private async testTeamsConnection(config: IntegrationConfig): Promise<boolean> {
    if (!config.accessToken) return false;

    const response = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    return response.ok;
  }

  private async testGoogleConnection(config: IntegrationConfig): Promise<boolean> {
    if (!config.accessToken) return false;

    const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: {
        'Authorization': `Bearer ${config.accessToken}`
      }
    });

    return response.ok;
  }

  private async testZoomConnection(config: IntegrationConfig): Promise<boolean> {
    if (!config.accessToken) return false;

    const response = await fetch('https://api.zoom.us/v2/users/me', {
      headers: {
        'Authorization': `Bearer ${config.accessToken}`
      }
    });

    return response.ok;
  }

  // Real-time data fetching
  async fetchRecentMessages(platform: string, hours: number = 24): Promise<CommunicationMessage[]> {
    const config = this.configs.get(platform);
    if (!config || !config.enabled) return [];

    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

    try {
      switch (platform) {
        case 'slack':
          return await this.fetchSlackMessages(config, since);
        case 'teams':
          return await this.fetchTeamsMessages(config, since);
        case 'google':
          return await this.fetchGoogleMessages(config, since);
        case 'zoom':
          return await this.fetchZoomTranscripts(config, since);
        default:
          return [];
      }
    } catch (error) {
      console.error(`Failed to fetch messages from ${platform}:`, error);
      return [];
    }
  }

  private async fetchSlackMessages(config: IntegrationConfig, since: string): Promise<CommunicationMessage[]> {
    if (!config.accessToken) return [];

    // First get channels
    const channelsResponse = await fetch('https://slack.com/api/conversations.list', {
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const channelsData = await channelsResponse.json();
    if (!channelsData.ok) return [];

    const messages: CommunicationMessage[] = [];

    // Fetch messages from each channel
    for (const channel of channelsData.channels.slice(0, 10)) { // Limit to first 10 channels
      const historyResponse = await fetch(`https://slack.com/api/conversations.history?channel=${channel.id}&oldest=${Math.floor(new Date(since).getTime() / 1000)}`, {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const historyData = await historyResponse.json();
      if (historyData.ok && historyData.messages) {
        for (const msg of historyData.messages) {
          if (msg.text && msg.text.trim()) {
            messages.push({
              id: msg.ts,
              platform: 'slack',
              channel: channel.name || channel.id,
              text: this.anonymizeText(msg.text),
              timestamp: new Date(parseFloat(msg.ts) * 1000).toISOString(),
              userId: this.anonymizeUserId(msg.user),
              teamId: 'default',
              metadata: {
                messageType: 'chat',
                isThread: !!msg.thread_ts
              }
            });
          }
        }
      }
    }

    return messages;
  }

  private async fetchTeamsMessages(config: IntegrationConfig, since: string): Promise<CommunicationMessage[]> {
    if (!config.accessToken) return [];

    // Microsoft Graph API for Teams messages
    const response = await fetch(`https://graph.microsoft.com/v1.0/me/chats`, {
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    const messages: CommunicationMessage[] = [];

    if (data.value) {
      for (const chat of data.value.slice(0, 10)) {
        const messagesResponse = await fetch(`https://graph.microsoft.com/v1.0/me/chats/${chat.id}/messages`, {
          headers: {
            'Authorization': `Bearer ${config.accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        const messagesData = await messagesResponse.json();
        if (messagesData.value) {
          for (const msg of messagesData.value) {
            if (msg.body?.content && new Date(msg.createdDateTime) > new Date(since)) {
              messages.push({
                id: msg.id,
                platform: 'teams',
                channel: chat.topic || 'Direct Chat',
                text: this.anonymizeText(this.stripHtml(msg.body.content)),
                timestamp: msg.createdDateTime,
                userId: this.anonymizeUserId(msg.from?.user?.id),
                teamId: 'default',
                metadata: {
                  messageType: 'chat'
                }
              });
            }
          }
        }
      }
    }

    return messages;
  }

  private async fetchGoogleMessages(config: IntegrationConfig, since: string): Promise<CommunicationMessage[]> {
    // Gmail API implementation would go here
    // For now, return empty array
    return [];
  }

  private async fetchZoomTranscripts(config: IntegrationConfig, since: string): Promise<CommunicationMessage[]> {
    // Zoom API implementation would go here
    // For now, return empty array
    return [];
  }

  private anonymizeText(text: string): string {
    // Remove email addresses
    text = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]');
    
    // Remove phone numbers
    text = text.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]');
    
    // Remove common names (basic implementation)
    const commonNames = ['john', 'jane', 'mike', 'sarah', 'david', 'emily', 'chris', 'lisa'];
    commonNames.forEach(name => {
      const regex = new RegExp(`\\b${name}\\b`, 'gi');
      text = text.replace(regex, '[NAME]');
    });

    return text;
  }

  private anonymizeUserId(userId?: string): string {
    if (!userId) return 'anonymous';
    
    // Create a consistent hash of the user ID
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return `user_${Math.abs(hash)}`;
  }

  private stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  // Webhook setup for real-time data
  setupWebhook(platform: string, webhookUrl: string) {
    const config = this.configs.get(platform) || {
      platform: platform as any,
      enabled: false,
      webhookUrl: ''
    };
    
    config.webhookUrl = webhookUrl;
    config.enabled = true;
    
    this.configs.set(platform, config);
    this.saveConfigurations();
  }

  // Simulate real-time data for development
  generateMockMessages(count: number = 10): CommunicationMessage[] {
    const messages: CommunicationMessage[] = [];
    const platforms = ['slack', 'teams', 'zoom'];
    const channels = ['general', 'engineering', 'product', 'leadership'];
    const sampleTexts = [
      'The new initiative is moving forward smoothly',
      'We need to pivot our strategy for next quarter',
      'Great progress on the project milestone',
      'There are some concerns about the timeline',
      'Let me circle back on that proposal',
      'We should align on the objectives',
      'The data shows promising results',
      'We need more visibility into the process'
    ];

    for (let i = 0; i < count; i++) {
      messages.push({
        id: `mock_${Date.now()}_${i}`,
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        channel: channels[Math.floor(Math.random() * channels.length)],
        text: sampleTexts[Math.floor(Math.random() * sampleTexts.length)],
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        userId: `user_${Math.floor(Math.random() * 100)}`,
        teamId: channels[Math.floor(Math.random() * channels.length)],
        metadata: {
          messageType: 'chat' as const
        }
      });
    }

    return messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}

export const dataIntegrationManager = new DataIntegrationManager();