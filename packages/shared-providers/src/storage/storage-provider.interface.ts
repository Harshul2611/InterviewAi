export interface StorageProvider {
  upload(file: Buffer, key: string): Promise<string>;
  delete(key: string): Promise<void>;
  getUrl(key: string): Promise<string>;
  exists(key: string): Promise<boolean>;
}
