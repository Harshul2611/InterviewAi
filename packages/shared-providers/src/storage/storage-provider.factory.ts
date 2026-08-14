import { LocalStorageProvider } from "./providers/local.provider";
import { S3StorageProvider } from "./providers/s3.provider";
import { StorageProvider } from "./storage-provider.interface";

export type StorageProviderType = "local" | "s3" | "r2";

export interface StorageFactoryConfig {
  provider: StorageProviderType;
  local?: {
    basePath: string;
    publicUrlPrefix: string;
  };
  s3?: {
    bucket: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    endpoint?: string;
    signedUrlExpirySeconds?: number;
  };
}

export class StorageFactory {
  static create(config: StorageFactoryConfig): StorageProvider {
    switch (config.provider) {
      case "local": {
        if (!config.local) {
          throw new Error(
            'StorageFactory: local config missing for provider "local"',
          );
        }
        return new LocalStorageProvider(
          config.local.basePath,
          config.local.publicUrlPrefix,
        );
      }
      case "s3":
      case "r2": {
        if (!config.s3) {
          throw new Error(
            `StorageFactory: s3 config missing for provider "${config.provider}"`,
          );
        }
        return new S3StorageProvider(config.s3);
      }
      default: {
        const _exhaustiveCheck: never = config.provider;
        throw new Error(
          `StorageFactory: unsupported provider "${_exhaustiveCheck}"`,
        );
      }
    }
  }
}
