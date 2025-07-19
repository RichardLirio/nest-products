import { z } from "zod/v3";

// Schema Zod para cxriacao de produto
export const createProductSchema = z.object({
  name: z
    .string({
      required_error: "Nome é obrigatório",
      invalid_type_error: "Nome deve ser uma string",
    })
    .min(1, "Nome não pode estar vazio")
    .max(255, "Nome deve ter no máximo 255 caracteres")
    .trim()
    .refine((name) => !name || !name.toLowerCase().includes("prohibited"), {
      message: "Nome não pode conter palavras proibidas",
    }),

  price: z
    .number({
      required_error: "Preço é obrigatório",
      invalid_type_error: "Preço deve ser um número",
    })
    .positive("Preço deve ser maior que zero")
    .max(999999.99, "Preço deve ser menor que 1 milhão"),

  sku: z
    .string({
      required_error: "SKU é obrigatório",
      invalid_type_error: "SKU deve ser uma string",
    })
    .min(1, "SKU não pode estar vazio")
    .max(100, "SKU deve ter no máximo 100 caracteres")
    .trim()
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "SKU deve conter apenas letras, números, hífens e underscores"
    ),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
