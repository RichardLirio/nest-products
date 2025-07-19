import { PipeTransform, BadRequestException } from "@nestjs/common";
import { z, z as zod } from "zod/v4";
import { fromError, createErrorMap } from "zod-validation-error/v4";

zod.config({
  customError: createErrorMap({
    includePath: true,
  }),
});

export class ZodValidationPipe implements PipeTransform {
  //validador do schema do zod
  constructor(private schema: z.ZodType) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value); //retorna o valor boolean quando realizado o parse
    } catch (error) {
      //ou retorna erro
      if (error) {
        const validationError = fromError(error);
        throw new BadRequestException({
          message: "Validation failed",
          statusCode: 400,
          errors: validationError.toString(),
        });
      }

      throw new BadRequestException("Validation failed");
    }
  }
}
