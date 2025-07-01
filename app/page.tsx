"use client";

import {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'motion/react';

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
    const [showNavButton, setShowNavButton] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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

    useEffect(() => {
        const handleScroll = () => {
            const heroDownloadButton = document.querySelector('.hero-download-button');
            if(heroDownloadButton) {
                const rect = heroDownloadButton.getBoundingClientRect();
                const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
                setShowNavButton(!isVisible);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const formatVersionNumber = (version: string): string => {
        const numbers = version.replace(/\D/g, '');

        if(numbers.length === 0) return version;

        const buildNumber = parseInt(numbers, 10);

        const major = buildNumber >= 500 ? Math.floor(buildNumber / 500) : 0;
        const minor = Math.floor((buildNumber % 500) / 50);
        const patch = buildNumber % 50;

        const formattedVersion = `${major}.${minor}.${patch}`;

        const prefix = version.replace(/[\d.]/g, '');
        return prefix + formattedVersion;
    };

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

    const handleLearnMore = () => {
        const featuresSection = document.getElementById('features');
        if(featuresSection) {
            featuresSection.scrollIntoView({behavior: 'smooth'});
        }
    };

    const getVersionText = () => {
        if(loading) return 'Loading...';
        if(latestRelease) return `Download ${formatVersionNumber(latestRelease.tag_name)}`;
        return 'Download Latest';
    };

    const getFormattedVersion = () => {
        if(!latestRelease) return '';
        return formatVersionNumber(latestRelease.tag_name);
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen bg-black text-white w-full max-w-full">
            <motion.nav
                initial={{y: -100, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{duration: 0.8, ease: "easeOut"}}
                className="flex fixed z-50 w-full justify-between items-center p-4 lg:p-6 bg-black/30 backdrop-blur-lg border-b border-neutral-800"
            >
                <div className="text-xl lg:text-2xl font-bold text-white flex items-center">
                    <motion.span
                        initial={{opacity: 0, scale: 0.8}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 0.6, delay: 0.2}}
                        className="text-violet-400"
                    >
                        <span className="drop-shadow-[0_0_5px_rgba(139,69,255,0.6)]">Rye</span> Client
                    </motion.span>
                </div>
                <div className="hidden md:flex space-x-6 lg:space-x-8">
                    {['Features', 'Download', 'Discord'].map((item, index) => (
                        <motion.a
                            key={item}
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5, delay: 0.3 + index * 0.1}}
                            whileHover={{color: "#8b45ff"}}
                            href={item === 'Discord' ? "https://discord.gg/J3XUnGaZjQ" : `#${item.toLowerCase()}`}
                            target={item === 'Discord' ? "_blank" : undefined}
                            className="text-neutral-300 hover:text-violet-400 transition-colors duration-300"
                        >
                            {item}
                        </motion.a>
                    ))}
                </div>
                <AnimatePresence>
                    {showNavButton && (
                        <motion.button
                            initial={{opacity: 0, y: -20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -20}}
                            transition={{duration: 0.3}}
                            onClick={handleDownload}
                            disabled={loading}
                            className="bg-violet-600 hover:bg-violet-500 text-white px-4 lg:px-6 py-2 rounded-md transition-all duration-300 shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Download
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.nav>

            <section
                className="flex flex-col lg:flex-row items-center justify-center min-h-screen px-6 md:px-12 lg:px-24 xl:px-32 py-20 lg:py-32 bg-black relative w-full">
                <div
                    className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-violet-600/20 opacity-30"></div>

                <motion.div
                    initial={{opacity: 0}}
                    animate={{
                        opacity: 1,
                        y: [-10, 10, -10],
                        rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                        opacity: {duration: 0.5},
                        y: {duration: 6, repeat: Infinity, ease: "easeInOut"},
                        rotate: {duration: 6, repeat: Infinity, ease: "easeInOut"}
                    }}
                    className="absolute top-10 right-10 w-64 h-64 lg:w-96 lg:h-96 bg-violet-500/20 rounded-full blur-3xl"
                ></motion.div>

                <motion.div
                    initial={{opacity: 0}}
                    animate={{
                        opacity: 1,
                        y: [10, -10, 10],
                        rotate: [0, -5, 5, 0],
                    }}
                    transition={{
                        opacity: {duration: 0.5, delay: 0.2},
                        y: {duration: 8, repeat: Infinity, ease: "easeInOut"},
                        rotate: {duration: 8, repeat: Infinity, ease: "easeInOut"}
                    }}
                    className="absolute bottom-10 left-10 w-64 h-64 lg:w-96 lg:h-96 bg-violet-500/15 rounded-full blur-3xl"
                ></motion.div>

                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center w-full relative z-10">
                    <motion.div
                        initial={{opacity: 0, x: -50}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 1, ease: "easeOut"}}
                        className="w-full lg:w-1/2 max-w-2xl text-center lg:text-left lg:pr-8"
                    >
                        <motion.h1
                            initial={{opacity: 0, y: 30}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.8, ease: "easeOut", delay: 0.2}}
                            className="text-4xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 leading-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                        >
                            Dominate the game<br/>
                            with <span
                            className="text-violet-400">Rye</span>{" "}
                            <span
                                className="bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">Client</span>.
                        </motion.h1>

                        <motion.p
                            initial={{opacity: 0, y: 30}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.8, ease: "easeOut", delay: 0.4}}
                            className="text-lg md:text-md lg:text-md text-neutral-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                        >
                            A premium-yet free-Minecraft utility mod built for the best possible experience.
                            <span
                                className="text-violet-400 drop-shadow-[0_0_5px_rgba(139,69,255,0.6)]"> Rye</span> currently
                            supports Fabric for Minecraft 1.21.6, providing a smooth and intuitive user experience.
                        </motion.p>

                        <motion.div
                            initial={{opacity: 0, y: 30}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.8, ease: "easeOut", delay: 0.6}}
                            className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
                        >
                            <motion.button
                                onClick={handleDownload}
                                whileHover={{scale: 1.05, background: "#dac1ed"}}
                                whileTap={{scale: 0.95}}
                                disabled={loading}
                                className="hero-download-button bg-white px-6 py-2 text-black rounded-full font-medium text-sm transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Loading...' : 'Download'}
                            </motion.button>

                            <motion.button
                                onClick={handleLearnMore}
                                whileHover={{scale: 1.05, borderColor: "#8b45ff", color: "#8b45ff"}}
                                whileTap={{scale: 0.95}}
                                className="border-2 border-neutral-600 text-neutral-300 px-6 py-2 rounded-full font-medium text-sm hover:bg-neutral-800/50 transition-all duration-300"
                            >
                                Learn more
                            </motion.button>
                        </motion.div>

                        <AnimatePresence>
                            {latestRelease && !loading && (
                                <motion.p
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -20}}
                                    transition={{duration: 0.6, delay: 0.8}}
                                    className="text-sm text-neutral-400 mt-6 text-center lg:text-left"
                                >
                                    Latest Release: {getVersionText() || getFormattedVersion()} •
                                    <a href={latestRelease.html_url} target="_blank" rel="noopener noreferrer"
                                       className="text-violet-400 hover:text-violet-300 ml-1">
                                        View on GitHub
                                    </a>
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.8 }}
                        className="hidden lg:flex w-full lg:w-1/2 justify-center lg:justify-end items-center lg:pl-8"
                    >
                        <motion.img
                            src="/clickgui.png"
                            alt="Click GUI"
                            className="w-[64rem] h-auto"
                            style={{
                                transform: 'perspective(1200px) rotateY(-10deg) rotateX(15deg)'
                            }}
                        />
                    </motion.div>
                </div>
            </section>

            <motion.section
                initial={{opacity: 0, y: 100}}
                whileInView={{opacity: 1, y: 0}}
                transition={{duration: 0.8, ease: "easeOut"}}
                viewport={{once: true, amount: 0.2}}
                id="features"
                className="py-20 px-6 md:px-12 bg-black w-full"
            >
                <div className="max-w-6xl mt-10 mx-auto text-center">
                    <motion.h2
                        initial={{opacity: 0, y: 50}}
                        whileInView={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, delay: 0.2}}
                        viewport={{once: true, amount: 0.5}}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    >
                        Why choose <span
                        className="text-violet-400">Rye</span>?
                    </motion.h2>

                    <motion.p
                        initial={{opacity: 0, y: 30}}
                        whileInView={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, delay: 0.4}}
                        viewport={{once: true, amount: 0.5}}
                        className="text-xl text-neutral-400 mb-16 max-w-3xl mx-auto"
                    >
                        With our abundant set of features, you&apos;ll never want to use another client.
                    </motion.p>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
                                title: "Feature-rich",
                                description: " has a vast number of modules with a variety of settings to choose from."
                            },
                            {
                                icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                                title: "User-friendly",
                                description: " is designed to be simple and easy to use."
                            },
                            {
                                icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
                                title: "Consistent updates",
                                description: " receives frequent updates to help you stay on top of the game."
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{opacity: 0, y: 50}}
                                whileInView={{opacity: 1, y: 0}}
                                transition={{duration: 0.6, delay: 0.2 * index}}
                                viewport={{once: true, amount: 0.3}}
                                whileHover={{scale: 1.05, y: -10}}
                                className="text-center p-6 rounded-lg border border-neutral-800/50 bg-neutral-900/20 backdrop-blur-sm shadow-lg hover:shadow-violet-500/20 transition-all duration-300 hover:border-violet-500/30"
                                style={{
                                    boxShadow: '0 0 20px rgba(139, 69, 255, 0.1), inset 0 0 20px rgba(139, 69, 255, 0.05)'
                                }}
                            >
                                <motion.div
                                    initial={{scale: 0}}
                                    whileInView={{scale: 1}}
                                    transition={{duration: 0.5, delay: 0.3 + 0.2 * index}}
                                    viewport={{once: true}}
                                    className="w-16 h-16 bg-violet-600 rounded-lg mx-auto mb-6 flex items-center justify-center shadow-lg"
                                    style={{
                                        boxShadow: '0 0 25px rgba(139, 69, 255, 0.4)'
                                    }}
                                >
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d={feature.icon}/>
                                    </svg>
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{feature.title}</h3>
                                <p className="text-neutral-400">
                                    <span
                                        className="text-violet-400 drop-shadow-[0_0_8px_rgba(139,69,255,0.8)]">Rye</span>
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            <motion.section
                initial={{opacity: 0, y: 100}}
                whileInView={{opacity: 1, y: 0}}
                transition={{duration: 0.8, ease: "easeOut"}}
                viewport={{once: true, amount: 0.2}}
                id="download"
                className="py-20 px-6 md:px-12 bg-black w-full"
            >
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h2
                        initial={{opacity: 0, y: 50}}
                        whileInView={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, delay: 0.2}}
                        viewport={{once: true, amount: 0.5}}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    >
                        Ready to Enhance Your Experience?
                    </motion.h2>

                    <motion.p
                        initial={{opacity: 0, y: 30}}
                        whileInView={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, delay: 0.4}}
                        viewport={{once: true, amount: 0.5}}
                        className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto"
                    >
                        Download <span
                        className="text-violet-400 drop-shadow-[0_0_5px_rgba(139,69,255,0.6)]">Rye Client</span> now and
                        experience Minecraft like never before. Compatible with the latest versions.
                    </motion.p>

                    <motion.div
                        initial={{opacity: 0, y: 30}}
                        whileInView={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, delay: 0.6}}
                        viewport={{once: true, amount: 0.5}}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <motion.button
                            onClick={handleDownload}
                            disabled={loading}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                            className="bg-violet-600 hover:bg-violet-500 text-white px-12 py-4 rounded-md font-semibold text-xl transition-all duration-300 shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {getVersionText()}
                        </motion.button>

                        <motion.button
                            whileHover={{scale: 1.05, borderColor: "#8b45ff", color: "#8b45ff"}}
                            whileTap={{scale: 0.95}}
                            onClick={() => latestRelease && window.open(latestRelease.html_url, '_blank')}
                            className="border-2 border-neutral-600 text-neutral-300 px-12 py-4 rounded-md font-semibold text-xl hover:bg-neutral-800/50 transition-all duration-300"
                        >
                            View Changelog
                        </motion.button>
                    </motion.div>

                    <motion.p
                        initial={{opacity: 0}}
                        whileInView={{opacity: 1}}
                        transition={{duration: 0.6, delay: 0.8}}
                        viewport={{once: true, amount: 0.5}}
                        className="text-sm text-neutral-400 mt-6"
                    >
                        Supports Minecraft 1.21.x • Windows, macOS, Linux
                        {latestRelease && (
                            <span className="block mt-2">Current Version: {getFormattedVersion()}</span>
                        )}
                    </motion.p>
                </div>
            </motion.section>

            <motion.footer
                initial={{opacity: 0, y: 50}}
                whileInView={{opacity: 1, y: 0}}
                transition={{duration: 0.8, ease: "easeOut"}}
                viewport={{once: true, amount: 0.1}}
                className="py-12 px-6 md:px-12 border-t border-neutral-800 bg-black w-full"
            >
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8">
                        <motion.div
                            initial={{opacity: 0, x: -50}}
                            whileInView={{opacity: 1, x: 0}}
                            transition={{duration: 0.6, delay: 0.2}}
                            viewport={{once: true}}
                        >
                            <div className="flex items-center space-x-2 mb-4">
                                <motion.h3 
                                    initial={{opacity: 0, scale: 0.8}}
                                    whileInView={{opacity: 1, scale: 1}}
                                    transition={{duration: 0.5, delay: 0.3}}
                                    viewport={{once: true}}
                                    className="text-xl lg:text-2xl font-bold text-violet-400"
                                >
                                    <span className="drop-shadow-[0_0_5px_rgba(139,69,255,0.6)]">Rye</span> Client
                                </motion.h3>
                            </div>
                            <p className="text-neutral-400">The ultimate Minecraft utility client for enhanced
                                gameplay.</p>
                        </motion.div>

                        {[
                            {
                                title: "Client",
                                links: [
                                    {text: "Download", action: () => handleDownload()},
                                    {text: "Features", href: "#features"},
                                    {
                                        text: "Changelog",
                                        href: "https://github.com/RyeClient/rye-v1/commits/main",
                                        external: true
                                    }
                                ]
                            },
                            {
                                title: "Support",
                                links: [
                                    {text: "Discord", href: "https://discord.gg/J3XUnGaZjQ", external: true},
                                    {
                                        text: "Bug Reports",
                                        href: "https://github.com/RyeClient/rye-v1/issues",
                                        external: true
                                    }
                                ]
                            },
                            {
                                title: "Legal",
                                links: [
                                    {
                                        text: "Terms of Use",
                                        href: "https://raw.githubusercontent.com/RyeClient/rye-v1/refs/heads/main/LICENSE"
                                    }
                                ]
                            }
                        ].map((section, index) => (
                            <motion.div
                                key={index}
                                initial={{opacity: 0, y: 30}}
                                whileInView={{opacity: 1, y: 0}}
                                transition={{duration: 0.6, delay: 0.2 * (index + 1)}}
                                viewport={{once: true}}
                            >
                                <h4 className="text-lg font-semibold text-white mb-4">{section.title}</h4>
                                <ul className="space-y-2 text-neutral-400">
                                    {section.links.map((link, linkIndex) => (
                                        <motion.li 
                                            key={linkIndex}
                                            initial={{opacity: 0, x: -20}}
                                            whileInView={{opacity: 1, x: 0}}
                                            transition={{duration: 0.4, delay: 0.3 + linkIndex * 0.1}}
                                            viewport={{once: true}}
                                        >
                                            {link.action ? (
                                                <motion.button
                                                    whileHover={{color: "#8b45ff", x: 5}}
                                                    onClick={link.action}
                                                    className="hover:text-violet-400 transition-colors"
                                                >
                                                    {link.text}
                                                </motion.button>
                                            ) : (
                                                <motion.a
                                                    whileHover={{color: "#8b45ff", x: 5}}
                                                    href={link.href}
                                                    target={link.external ? "_blank" : undefined}
                                                    rel={link.external ? "noopener noreferrer" : undefined}
                                                    className="hover:text-violet-400 transition-colors"
                                                >
                                                    {link.text}
                                                </motion.a>
                                            )}
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{opacity: 0}}
                        whileInView={{opacity: 1}}
                        transition={{duration: 0.6, delay: 0.8}}
                        viewport={{once: true}}
                        className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400"
                    >
                        <p>&copy; {new Date().getFullYear()} <span
                            className="text-violet-400 drop-shadow-[0_0_5px_rgba(139,69,255,0.6)]">Rye Client</span>.
                            Not affiliated with Mojang Studios or Microsoft.</p>
                    </motion.div>
                </div>
            </motion.footer>
        </div>
    );
}