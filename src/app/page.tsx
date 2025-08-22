"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple admin check - in production this would be server-side
    if (email === "admin@statuspage.com" && password === "admin123") {
      // Redirect to dashboard (this is a demo - in real app would use proper auth)
      window.location.href = "/dashboard";
    } else {
      alert("Invalid credentials. Use: admin@statuspage.com / admin123");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto py-16">
        <h1 className="text-4xl font-semibold">StatusPage</h1>
        <p className="text-gray-600 mt-2">Manage your services and incidents with live updates.</p>

        <div className="mt-8 space-y-6">
          {/* Admin Login Form */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="font-semibold text-blue-800 mb-4">Admin Access</h2>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@statuspage.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Signing In..." : "Sign In as Admin"}
              </button>
            </form>
            <div className="mt-3 text-xs text-gray-600">
              <strong>Demo Credentials:</strong><br/>
              Email: admin@statuspage.com<br/>
              Password: admin123
            </div>
          </div>

          {/* Public Access */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Public Access</h2>
            <p className="text-gray-700 text-sm mb-4">
              View the public status page (no authentication required).
            </p>
            <Link
              href="/s"
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 inline-block"
            >
              View Public Status
            </Link>
          </div>
        </div>

        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-3">Features</h3>
          <ul className="text-green-700 text-sm space-y-1 list-disc list-inside">
            <li>Real-time service status monitoring with WebSocket updates</li>
            <li>Live incident management and notifications</li>
            <li>Professional admin dashboard with real-time data</li>
            <li>Public status page for customers</li>
            <li>Secure authentication system</li>
            <li>Mobile responsive design</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
