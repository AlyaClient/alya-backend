"use client";

import {useState, useEffect} from 'react';

interface Release {
    tag_name: string;
    name: string;
    html_url: string;
    assets: Array<{
        name: string;
        browser_download_url: string;
    }>;
}

export default function Home() {
    const [latestRelease, setLatestRelease] = useState<Release | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestRelease = async() => {
            try {
                const response = await fetch('https://api.github.com/repos/RyeClient/rye-v1/releases');

                const releases = await response.json();
                if(releases.length > 0) {
                    setLatestRelease(releases[0]);
                }
            } catch(error) {
                console.error('Failed to fetch release data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestRelease().then();
    }, []);

    const handleDownload = () => {
        if(latestRelease == null) return;

        if(latestRelease?.assets.length > 0) {
            window.open(latestRelease.assets[1].browser_download_url, '_blank');
        } else if(latestRelease?.html_url) {
            window.open(latestRelease.html_url, '_blank');
        } else {
            window.open('https://github.com/RyeClient/rye-v1/releases/latest', '_blank');
        }
    };

    const getVersionText = () => {
        if(loading) return 'Loading...';
        if(latestRelease) return `Download ${latestRelease.tag_name}`;
        return 'Download Latest';
    };

    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden">
            <nav className="flex fixed z-90 w-full justify-between items-center p-6 lg:p-8 bg-neutral-950/50 backdrop-blur-2xl border-b border-neutral-700">
                <div className="text-2xl font-bold text-white flex items-center space-x-2">
                    <span>Rye Client</span>
                </div>
                <div className="hidden md:flex space-x-8">
                    <a href="#features"
                       className="text-neutral-300 hover:text-purple-400 transition-colors duration-300">Features</a>
                    <a href="#download"
                       className="text-neutral-300 hover:text-purple-400 transition-colors duration-300">Download</a>
                    <a href="https://discord.gg/J3XUnGaZjQ"
                       target="_blank"
                       className="text-neutral-300 hover:text-purple-400 transition-colors duration-300"
                    >
                        Support
                    </a>
                </div>
                <button
                    onClick={handleDownload}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-md transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Loading...' : (latestRelease ? "Download " + latestRelease.tag_name : 'Download')}
                </button>
            </nav>

            <section
                className="flex flex-col items-center justify-center text-center h-[115vh] px-6 py-20 lg:py-32 bg-gradient-to-b from-neutral-950 bg-black relative">
                <div className="absolute inset-0 bg-gradient-radial from-purple-500/80 to-transparent opacity-75"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.15),transparent_50%)]"></div>
                <div className="absolute -top-48 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-48 -right-48 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 -left-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute -top-32 right-1/4 w-72 h-72 bg-violet-500/12 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
                <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(168,85,247,0.1),transparent_40%)] pointer-events-none"></div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Rye Client
                    </h1>
                    <p className="text-xl md:text-2xl text-neutral-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                        The ultimate Minecraft utility client. Enhance your gameplay with powerful features,
                        optimizations, and quality-of-life improvements.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleDownload}
                            disabled={loading}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-md font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                            <span className="relative z-10">{getVersionText()}</span>
                        </button>
                        <button
                            className="border-2 border-neutral-600 text-neutral-300 px-8 py-4 rounded-md font-semibold text-lg hover:bg-neutral-900/70 hover:border-purple-400 hover:text-purple-400 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                            <span className="relative z-10">View Features</span>
                        </button>
                    </div>
                    {latestRelease && !loading && (
                        <p className="text-sm text-neutral-400 mt-4">
                            Latest Release: {latestRelease.name || latestRelease.tag_name} •
                            <a
                                href={latestRelease.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 hover:text-purple-300 ml-1"
                            >
                                View on GitHub
                            </a>
                        </p>
                    )}
                </div>
            </section>

            <section id="features" className="py-20 px-6 relative">
                <div className="absolute -top-48 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-48 right-1/4 w-80 h-80 bg-indigo-500/8 rounded-full blur-3xl"></div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
                        Powerful Utilities
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div
                            className="bg-neutral-950 p-8 rounded-lg border border-neutral-700 hover:border-purple-500 hover:bg-neutral-650 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                            <div className="w-12 h-12 bg-purple-600 rounded-md mb-6 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-purple-500/30 rounded-md blur-md group-hover:blur-lg transition-all duration-300"></div>
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-4 relative z-10">Performance Boost</h3>
                            <p className="text-neutral-300 relative z-10">Optimize your Minecraft experience with improved FPS¹, reduced lag, and smoother gameplay.</p>
                        </div>

                        <div
                            className="bg-neutral-950 p-8 rounded-lg border border-neutral-700 hover:border-purple-500 hover:bg-neutral-650 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                            <div className="w-12 h-12 bg-purple-600 rounded-md mb-6 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-purple-500/30 rounded-md blur-md group-hover:blur-lg transition-all duration-300"></div>
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-4 relative z-10">Utility Mods</h3>
                            <p className="text-neutral-300 relative z-10">Includes bypasses for various AntiCheats and Utility mods</p>
                        </div>

                        <div
                            className="bg-neutral-950 p-8 rounded-lg border border-neutral-600 hover:border-purple-500 hover:bg-neutral-650 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                            <div className="w-12 h-12 bg-purple-600 rounded-md mb-6 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-purple-500/30 rounded-md blur-md group-hover:blur-lg transition-all duration-300"></div>
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-4 relative z-10">Safe & Secure</h3>
                            <p className="text-neutral-300 relative z-10">Built with security in mind. Safe to use on most servers with
                                undetectable features.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 relative">
                <div className="absolute top-1/2 -left-36 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-blue-500/6 rounded-full blur-3xl"></div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
                        Advanced Features
                    </h2>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-6">Enhanced Gameplay</h3>
                            <ul className="space-y-4 text-neutral-300">
                                <li className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
                                    <span>Advanced HUD with dynamic elements</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
                                    <span>Advanced Scripting API²</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
                                    <span>Powerful and bypassing KillAura</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
                                    <span>Easy to use</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
                                    <span>Open-Source</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-neutral-800 p-8 rounded-lg border border-neutral-700 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                            <div className="bg-neutral-700 h-48 rounded-md flex items-center justify-center border-2 border-dashed border-neutral-600 relative">
                                <div className="text-center relative z-10">
                                    <p className="text-neutral-400">Screenshot Preview</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="download" className="py-20 px-6 relative">
                <div className="absolute -top-48 left-1/3 w-80 h-80 bg-purple-500/12 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-48 right-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Enhance Your Experience?
                    </h2>
                    <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
                        Download Rye Client now and experience Minecraft like never before. Compatible with the latest
                        versions.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleDownload}
                            disabled={loading}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-12 py-4 rounded-md font-semibold text-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                            <span className="relative z-10">{getVersionText()}</span>
                        </button>
                        <button
                            onClick={() => latestRelease && window.open(latestRelease.html_url, '_blank')}
                            className="border-2 border-neutral-600 text-neutral-300 px-12 py-4 rounded-md font-semibold text-xl hover:bg-neutral-950/70 hover:border-purple-400 hover:text-purple-400 transition-all duration-300 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                            <span className="relative z-10">View Changelog</span>
                        </button>
                    </div>
                    <p className="text-sm text-neutral-400 mt-6">
                        Supports Minecraft 1.21.x • Windows, macOS, Linux
                        {latestRelease && (
                            <span className="block mt-2">
                Current Version: {latestRelease.tag_name}
              </span>
                        )}
                    </p>
                </div>
            </section>

            <footer className="py-12 px-6 border-t border-neutral-700">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-purple-600 rounded-sm"></div>
                                <h3 className="text-2xl font-bold text-white">Rye Client</h3>
                            </div>
                            <p className="text-neutral-400">The ultimate Minecraft utility client for enhanced
                                gameplay.</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Client</h4>
                            <ul className="space-y-2 text-neutral-400">
                                <li>
                                    <button onClick={handleDownload}
                                            className="hover:text-purple-400 transition-colors">Download
                                    </button>
                                </li>
                                <li><a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
                                </li>
                                <li><a href="https://github.com/RyeClient/rye-v1/commits/main" target="_blank" rel="noopener noreferrer"
                                       className="hover:text-purple-400 transition-colors">Changelog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
                            <ul className="space-y-2 text-neutral-400">
                                <li><a
                                    href="https://discord.gg/J3XUnGaZjQ"
                                    target="_blank"
                                    className="hover:text-purple-400 transition-colors"
                                >
                                    Discord
                                </a></li>
                                <li><a href="https://github.com/RyeClient/rye-v1/issues" target="_blank"
                                       rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">Bug
                                    Reports</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
                            <ul className="space-y-2 text-neutral-400">
                                <li><a
                                    href="https://raw.githubusercontent.com/RyeClient/rye-v1/refs/heads/main/LICENSE"
                                    className="hover:text-purple-400 transition-colors"
                                >
                                    Terms of Use
                                </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-neutral-700 mt-8 pt-8 text-center text-neutral-400">
                        <div className="text-neutral-400 mb-8 text-center">
                            <p>¹Feature is still a work in progress (Expected Q3 2025)</p>
                            <p>²Scripting API is not finished or available yet (Expected Q4 2025)</p>
                        </div>

                        <p>&copy; {new Date().getFullYear()} Rye Client. Not affiliated with Mojang Studios.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}