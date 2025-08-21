import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto py-16">
        <h1 className="text-4xl font-semibold">StatusPage</h1>
        <p className="text-gray-600 mt-2">Manage your services and incidents with live updates.</p>
        
        <div className="mt-8 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="font-semibold text-blue-800 mb-2">Admin Access</h2>
            <p className="text-blue-700 text-sm mb-3">
              Sign in to access the admin dashboard and manage services/incidents.
            </p>
            <div className="space-x-3">
              <SignInButton mode="modal">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h2 className="font-semibold text-gray-800 mb-2">Public Access</h2>
            <p className="text-gray-700 text-sm mb-3">
              View the public status page (no authentication required).
            </p>
            <Link href="/s" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 inline-block">
              View Public Status
            </Link>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Features</h3>
          <ul className="text-green-700 text-sm space-y-1 list-disc list-inside">
            <li>Real-time service status monitoring</li>
            <li>Live incident management</li>
            <li>WebSocket-powered updates</li>
            <li>Professional admin dashboard</li>
            <li>Public status page for customers</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
