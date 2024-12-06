import {
  ArgumentMetadata,
  Inject,
  Injectable,
  PipeTransform,
  Type,
} from '@nestjs/common';

export function EntityExistsPipe(entityCls: Type): Type<PipeTransform> {
  @Injectable()
  class EntityExistsPipeCls implements PipeTransform {
    constructor(
      @Inject(entityCls)
      private entityReposetory: { exists(condition: unknown): Promise<void> },
    ) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async transform(value: any, metadata: ArgumentMetadata) {
      await this.entityReposetory.exists({ where: { id: value } }); //throw if entity does not exist
      return value;
    }
  }
  return EntityExistsPipeCls;
}
