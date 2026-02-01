// gate-simulator/src/app/page.js

import GateSimulator from './components/GateSimulator';
import './globals.css';

export default function Home() {
  return (
    <main className="min-h-screen">
      <GateSimulator />
    </main>
  );
}