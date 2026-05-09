import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticleNetwork() {
    const particlesInit = async (engine) => {
        await loadFull(engine);
    };

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            className="absolute inset-0 z-0 pointer-events-none"
            options={{
                background: {
                    color: {
                        value: "transparent",
                    },
                },
                fpsLimit: 60,
                interactivity: {
                    events: {
                        onHover: {
                            enable: true,
                            mode: "grab",
                        },
                        resize: true,
                    },
                    modes: {
                        grab: {
                            distance: 140,
                            links: {
                                opacity: 0.2
                            }
                        }
                    },
                },
                particles: {
                    color: {
                        value: ["#005129", "#d4c9a8"],
                    },
                    links: {
                        color: "#d4c9a8",
                        distance: 150,
                        enable: true,
                        opacity: 0.15,
                        width: 1,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: true,
                        speed: 0.4,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 40,
                    },
                    opacity: {
                        value: 0.15,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 2 },
                    },
                },
                detectRetina: true,
            }}
        />
    );
}
