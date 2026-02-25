// Centralized GSAP + ScrollTrigger setup
// Import this module instead of registering plugins individually
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
