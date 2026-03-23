export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="nwi-panel rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-semibold">NWI</h1>
        <p className="mt-2 text-sm text-nwi-muted">Requested page was not found.</p>
      </div>
    </main>
  );
}
