"use client"

import { useState } from "react"
import { login } from "../../../lib/auth"
import { TbEye, TbEyeClosed } from "react-icons/tb"

export default function LoginPage() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (loading) return

        setError(null)
        setLoading(true)

        try {
            await login(username, password)

            window.location.href = "/";
        } catch (err) {
            console.error(err)
            setError(err instanceof Error ? err.message : "Login gagal")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <h2 className="text-center text-xl font-semibold text-gray-800">
                Login
            </h2>

            {error && (
                <div className="rounded-md bg-red-50 px-4 py-2 text-center text-sm text-red-600">
                    {error}
                </div>
            )}

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                   focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
                autoComplete="username"
            />

            <div className="relative">
                <input
                    value={password}
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm
                     focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                    autoComplete="current-password"
                />

                <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500
                     hover:text-blue-600 focus:outline-none"
                    aria-label="Toggle password visibility"
                >
                    {showPassword ? <TbEye size={18} /> : <TbEyeClosed size={18} />}
                </button>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white
                   hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loading ? "Loading..." : "Login"}
            </button>
        </form>
    )
}
