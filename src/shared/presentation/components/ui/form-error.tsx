export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p className="rounded-lg bg-destructive/10 text-destructive px-4 py-3 text-sm">
      {message}
    </p>
  );
}