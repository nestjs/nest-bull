import { FactoryProvider, ModuleMetadata, Type } from '@nestjs/common';
import * as Bull from 'bull';
import { BullQueueProcessor } from '../bull.types';

export interface BullRootModuleOptions extends Bull.QueueOptions {
  /**
   * Redis client connection string
   */
  url?: string;
}

export interface BullModuleOptions extends BullRootModuleOptions {
  /**
   * Queue name
   *
   * @default default
   */
  name?: string;

  /**
   * Shared configuration key
   *
   * @default default
   */
  configKey?: string;

  /**
   * Additional queue processors
   */
  processors?: BullQueueProcessor[];

  /**
   * Callback for application shutdown, for eg. to do `queue.pause(true)` to pause processing
   * The default behavior is `queue.close()`
   */
  onApplicationShutdown?: (queue: Bull.Queue) => Promise<void>;
}

export interface BullOptionsFactory {
  createBullOptions(): Promise<BullModuleOptions> | BullModuleOptions;
}

export interface BullModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Queue name.
   *
   * @default default
   */
  name?: string;

  /**
   * Shared configuration key.
   */
  configKey?: string;

  /**
   * Callback for application shutdown, for eg. to do `queue.pause(true)` to pause processing
   * The default behavior is `queue.close()`
   */
  onApplicationShutdown?: (queue: Bull.Queue) => Promise<void>;

  /**
   * Existing Provider to be used.
   */
  useExisting?: Type<BullOptionsFactory>;

  /**
   * Type (class name) of provider (instance to be registered and injected).
   */
  useClass?: Type<BullOptionsFactory>;

  /**
   * Factory function that returns an instance of the provider to be injected.
   */
  useFactory?: (
    ...args: any[]
  ) => Promise<BullModuleOptions> | BullModuleOptions;

  /**
   * Optional list of providers to be injected into the context of the Factory function.
   */
  inject?: FactoryProvider['inject'];
}
