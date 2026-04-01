import React from 'react';
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Logo from "../components/Logo";
import { Compass, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 animate-in zoom-in-95 duration-500">
        <Link to="/" className="inline-block mb-12 hover:opacity-80 transition-opacity">
            <Logo type="full" />
        </Link>
        
        <div className="relative mb-8">
            <h1 className="text-[180px] font-black text-primary/5 tracking-tighter leading-none select-none">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center text-primary border border-border-light animate-bounce">
                    <Compass className="w-12 h-12" />
                </div>
            </div>
        </div>

        <h2 className="text-3xl font-black text-text-main uppercase tracking-tighter mb-4">Protocol Divergence</h2>
        <p className="mt-2 text-text-body max-w-md mx-auto font-medium leading-relaxed opacity-80">
          The requested navigational coordinate does not exist within the current institutional database. 
          The page may have been decommissioned or relocated.
        </p>
        
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/" className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-14 px-8 font-black uppercase tracking-widest text-xs flex items-center gap-2 group">
                    <Home className="w-4 h-4" /> Return to Base
                </Button>
            </Link>
            <button 
                onClick={() => window.history.back()}
                className="w-full sm:w-auto px-8 h-14 rounded-2xl border-2 border-border-light text-text-muted font-black uppercase tracking-widest text-xs hover:bg-white hover:text-primary transition-all flex items-center justify-center gap-2"
            >
                <ArrowLeft className="w-4 h-4" /> Previous State
            </button>
        </div>
      </div>
    </div>
  );
}
