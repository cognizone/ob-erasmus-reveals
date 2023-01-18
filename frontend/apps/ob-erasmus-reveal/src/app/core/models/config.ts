export interface BaseConfig {
  baseUri: string;
  baseUriForNewItems: string;
  dataVersions: {
    [collectionName: string]: number;
  };
}

export interface Config extends BaseConfig {
  server: ServerConfig;
}

export interface ServerConfig {
  elasticProxyUrl: string;
  index: string;
}
