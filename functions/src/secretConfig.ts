type AppSecretConfig = {
  discordClientId: string;
  discordClientSecret: string;
};

/**
 * AppSecretConfig の取得を行うクラス
 */
export class AppSecretConfigHandler {
  private config: AppSecretConfig | undefined;

  /**
   * AppSecretConfig を取得する
   * @return {AppSecretConfig}
   */
  get(): AppSecretConfig {
    if (!this.config) {
      const configString = process.env.APP_SECRET_CONFIG;
      if (!configString) {
        throw new Error("APP_SECRET_CONFIG is not defined");
      }
      this.config = JSON.parse(configString) as AppSecretConfig;
    }
    return this.config;
  }
}

