import { z } from "zod";

/**
 * Server actions accept data from the client. Trusting those values without
 * runtime validation is a security hole (any field can be tampered with) and
 * a reliability hole (a missing optional field quietly becomes `undefined`).
 *
 * Use `parseActionInput` at the start of every use-case that receives a
 * structured payload from the client. It validates, transforms (e.g. trims
 * strings, applies defaults), and returns the typed result.
 *
 * On failure it throws `ActionValidationError` so the surrounding
 * `withWorkspacePermission` wrapper doesn't catch it as something else.
 */

export class ActionValidationError extends Error {
    constructor(
        public readonly issues: z.core.$ZodIssue[],
        public readonly flattened: z.core.$ZodFlattenedError<unknown>
    ) {
        super(
            `Invalid action input: ${issues
                .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
                .join("; ")}`
        );
        this.name = "ActionValidationError";
    }
}

export function parseActionInput<T extends z.ZodTypeAny>(
    schema: T,
    input: unknown
): z.infer<T> {
    const result = schema.safeParse(input);
    if (!result.success) {
        throw new ActionValidationError(result.error.issues, z.flattenError(result.error) as z.core.$ZodFlattenedError<unknown>);
    }
    return result.data;
}

/**
 * A 21-character nanoid as produced by BetterAuth for IDs. We restrict
 * user-supplied identifiers to this format to keep them opaque (no
 * injection into queries that may not be parameterised) and to fail fast
 * when an ID is wrong.
 */
export const nanoidSchema = z
    .string()
    .min(1)
    .max(64)
    .regex(/^[A-Za-z0-9_-]+$/, "must be a valid id");

/** Shorthand URL validator with an upper bound so we don't accept multi-MB strings. */
export const urlSchema = z.string().url().max(2048);

/** A non-empty trimmed string with a sane upper bound. */
export const shortTextSchema = z
    .string()
    .transform((s) => s.trim())
    .refine((s) => s.length > 0, "must not be empty")
    .pipe(z.string().max(500));

/** A longer text blob (caption, description) — bounded to avoid abuse. */
export const longTextSchema = z.string().max(10_000);