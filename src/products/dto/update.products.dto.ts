import z from "zod/v3";
import { createProductSchema } from "./create.products.dto";

// Schema Zod para atualização (todos os campos opcionais)
export const updateProductSchema = createProductSchema.partial();

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
