import { PipeTransform, BadRequestException } from "@nestjs/common";
import { ZodError, ZodSchema } from "zod/v3";
import { fromZodError } from "zod-validation-error";

export class ZodValidationPipe implements PipeTransform {
  //validador do schema do zod
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const isValid: boolean = this.schema.parse(value); //retorna o valor boolean quando realizado o parse
      return isValid;
    } catch (error) {
      //ou retorna erro
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: "Validation failed",
          statusCode: 400,
          errors: fromZodError(error),
        });
      }

      throw new BadRequestException("Validation failed");
    }
  }
}
