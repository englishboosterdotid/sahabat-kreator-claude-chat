import { z } from "zod";

/**
 * Parse an input against a Zod schema, throwing a clean error if it fails.
 * Use this at the top of use-case handlers so a malformed input from the
 * presentation layer fails loudly with field-level detail instead of producing
 * obscure downstream errors (e.g. Drizzle insert type errors, null pointer
 * derefs at runtime).
 *
 * The thrown Error contains a JSON-serialized issues array — use-cases are
 * "use server", so the error message propagates back to the client where it
 * can be surfaced in the UI.
 */
export function parseActionInput<S extends z.ZodTypeAny>(schema: S, input: unknown): z.infer<S> {
    const result = schema.safeParse(input);
    if (!result.success) {
        const issues = result.error.issues
            .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
            .join("; ");
        throw new Error(`Input tidak valid: ${issues}`);
    }
    return result.data;
}