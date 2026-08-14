import { promises as fs } from "node:fs";
import path from "path";
import type { StorageProvider } from "../storage-provider.interface";

export class LocalStorageProvider implements StorageProvider {
  private readonly basePath: string;
  private readonly publicUrlPrefix: string;

  constructor(basePath: string, publicUrlPrefix: string) {
    this.basePath = basePath;
    this.publicUrlPrefix = publicUrlPrefix;
  }

  async upload(file: Buffer, key: string): Promise<string> {
    const fullPath = path.join(this.basePath, key);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, file);
    return this.getUrl(key);
  }

  async getUrl(key: string): Promise<string> {
    return `${this.publicUrlPrefix}/${key}`;
  }

  async delete(key: string): Promise<void> {
    const fullPath = path.join(this.basePath, key);
    try {
      await fs.unlink(fullPath);
    } catch (error: any) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      await fs.access(path.join(this.basePath, key));
      return true;
    } catch (error: any) {
      return false;
    }
  }
}
