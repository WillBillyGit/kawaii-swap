/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Toaster } from "sonner";
import GalaxyBackground from "./components/GalaxyBackground";
import WalletConnector from "./components/WalletConnector";
import TransmutationInterface from "./components/TransmutationInterface";
import DodoBirds from "./components/DodoBirds";

export default function App() {
  return (
    <main className="min-h-screen relative font-sans selection:bg-kawaii-pink/30">
      <Toaster theme="dark" position="top-right" closeButton richColors />
      <GalaxyBackground />
      <DodoBirds />
      
      <div className="relative z-10 font-sans">
        <header>
          <WalletConnector />
        </header>

        <section className="container mx-auto">
          <TransmutationInterface />
        </section>

        <footer className="fixed bottom-6 left-0 right-0 text-center text-white/20 text-[10px] uppercase tracking-[0.2em] pointer-events-none">
          Designed for the Cosmic Transmutation Bridge 
        </footer>
      </div>
    </main>
  );
}
