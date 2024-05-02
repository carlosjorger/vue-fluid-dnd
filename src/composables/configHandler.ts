import { Config } from ".";

export default class ConfigHandler {
  static configs = [] as Config[];
  static triggerConfig(config: Config) {
    ConfigHandler.configs.push(config);
  }
}
