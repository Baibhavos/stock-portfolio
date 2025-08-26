'use client';
export function ErrorBanner({ message, title = 'Error' }: { message: string; title?: string }) {
  return (
    <div>
      <div>{title}</div>
      <div>{message}</div>
    </div>
  );
}
