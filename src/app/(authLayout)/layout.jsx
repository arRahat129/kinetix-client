import Link from "next/link";
import { FaRocket, FaGithub, FaCompass } from "react-icons/fa";
import ThemeToggle from "@/components/ThemeToggle";

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-4 transition-colors duration-300">
            <div className="w-full max-w-md flex flex-col gap-4">
                {/* Navbar matching form container width */}
                <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3 flex items-center justify-between shadow-lg transition-colors duration-300">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">
                        <FaRocket className="text-blue-600 dark:text-blue-500" />
                        <span>KINETIX</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Link 
                            href="/explore" 
                            className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors px-2 py-1.5 rounded-lg"
                        >
                            <FaCompass />
                            <span className="hidden sm:inline">Explore</span>
                        </Link>
                        <a 
                            href="https://github.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                        >
                            <FaGithub />
                            <span>Developer</span>
                        </a>
                    </div>
                </header>

                {/* Main Auth Content */}
                <main className="w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}

