const { promises: fs, existsSync, mkdirSync } = require('fs');
const { homedir } = require('os');
const { join } = require('path');
const YAML = require('js-yaml');
const {UpdateMode} = require('../update-mode')

class Config {
  async init() {
    mkdirSync(this.configDirectory, { recursive: true, mode: 0o770 });
    if (this.configExists) {
      await this.load();
    }
  }

  get initialWaitTimeInMinutes() {
    return this.config.initialWaitTimeInMinutes || 5;
  }

  get apiKey() {
    return this.config.apiKey;
  }

  get nodeId() {
    return this.config.nodeId || '';
  }

  get chiaConfigDirectory() {
    return this.config.chiaConfigDirectory;
  }

  get chiaDaemonAddress() {
    return this.config.chiaDaemonAddress;
  }

  get excludedServices() {
    return this.config.excludedServices;
  }

  get chiaDashboardCoreUrl() {
    return this.config.chiaDashboardCoreUrl || 'https://dashboard.netman.digital';
  }

  get responseTimeSampleSize() {
    return this.config.responseTimeSampleSize || 100
  }

  get maximumFarmingInfos() {
    return Math.min(this.config.maximumFarmingInfos || 20, 100)
  }

  get updateMode() {
    if (this.config.updateMode === undefined) {
      return UpdateMode.regular
    }

    return UpdateMode[this.config.updateMode] || UpdateMode.regular
  }

  get enableCompatibilityMode() {
    if (this.config.enableCompatibilityMode !== undefined) {
      return this.config.enableCompatibilityMode
    }

    return this.chiaDashboardCoreUrl !== Config.defaultFoxyDashboardApiUrl
  }

  get configExists() {
    return existsSync(this.configFilePath);
  }

  get summaryReportInterval() {
    return this.config.summaryReportInterval;
  }
  
  get notifyTimeoutInMins() {
    return this.config.notifyTimeoutInMins || 3;
  }

  get emailNotificationsEnabled() {
    return this.config.emailNotificationsEnabled;
  }

  get emailService() {
    return this.config.emailService;
  }

  get senderEmail() {
    return this.config.senderEmail;
  }

  get senderPassword() {
    return this.config.senderPassword;
  }

  get recipientEmail() {
    return this.config.recipientEmail;
  }

  get lineNotificationsEnabled() {
    return this.config.lineNotificationsEnabled;
  }

  get lineNotifyAccessToken() {
    return this.config.lineNotifyAccessToken;
  }

  async load() {
    const yaml = await fs.readFile(this.configFilePath, 'utf8');
    this.config = YAML.load(yaml);
  }

  async save() {
    const yaml = YAML.dump(this.config, {
      lineWidth: 140,
    });
    await fs.writeFile(this.configFilePath, yaml, 'utf8');
  }

  get configFilePath() {
    return join(this.configDirectory, 'config.yaml')
  }

  get configDirectory() {
    return join(homedir(), '.config', 'chia-dashboard-satellite');
  }

  get alertConditions() {
    return this.config.alertConditions || {
      passedFilterTimeout: 60, // 1 minute
      plotDropThresholdPercent: 10,
      harvesterResponseTimeThreshold: 60000, // 1 minute in milliseconds
    };
  }
}

module.exports = new Config();
