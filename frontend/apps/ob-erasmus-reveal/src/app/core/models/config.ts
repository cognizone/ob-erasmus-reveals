export interface Config {
  baseUri: string;
  baseUriForNewItems: string;
  dataVersions: {
    [collectionName: string]: number;
  };
}
