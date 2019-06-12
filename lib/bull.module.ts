import {
  DynamicModule,
  Module,
  OnModuleInit,
  Logger,
  Global,
} from '@nestjs/common';
import { BullModuleOptions, BullModuleAsyncOptions } from './bull.interfaces';
import {
  createQueueOptionProviders,
  createQueueProviders,
  createAsyncQueueOptionsProviders,
} from './bull.providers';
import { BullExplorer } from './bull.explorer';

@Global()
@Module({})
export class BullModule implements OnModuleInit {
  static forRoot(
    options: BullModuleOptions | BullModuleOptions[],
  ): DynamicModule {
    const queueProviders = createQueueProviders([].concat(options));
    const queueOptionProviders = createQueueOptionProviders([].concat(options));
    return {
      module: BullModule,
      providers: [
        ...queueOptionProviders,
        ...queueProviders,
        BullExplorer,
        { provide: Logger, useValue: new Logger('BullModule') },
      ],
      exports: queueProviders,
    };
  }

  static forRootAsync(
    options: BullModuleAsyncOptions | BullModuleAsyncOptions[],
  ): DynamicModule {
    const optionsArr = [].concat(options);
    const queueProviders = createQueueProviders(optionsArr);
    const queueOptionProviders = createAsyncQueueOptionsProviders(optionsArr);
    const imports =
      optionsArr
        .map(option => option.imports)
        .reduce((acc = [], i) => {
          acc.push(i);
        }) || [];
    return {
      imports,
      module: BullModule,
      providers: [
        ...queueOptionProviders,
        ...queueProviders,
        BullExplorer,
        { provide: Logger, useValue: new Logger('BullModule') },
      ],
      exports: queueProviders,
    };
  }

  constructor(private readonly explorer: BullExplorer) {}

  onModuleInit() {
    this.explorer.explore();
  }
}
