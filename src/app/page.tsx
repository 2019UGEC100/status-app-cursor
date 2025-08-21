import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto py-16">
        <h1 className="text-4xl font-semibold">StatusPage</h1>
        <p className="text-gray-600 mt-2">Manage your services and incidents with live updates.</p>
        <div className="mt-6 space-x-3">
          <Link href="/dashboard" className="underline">Go to Dashboard</Link>
          <Link href="/s" className="underline">View Public Status</Link>
        </div>
      </div>
    </div>
  );
}
