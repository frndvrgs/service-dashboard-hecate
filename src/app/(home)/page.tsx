"use client";

import React from "react";
import Link from "next/link";
import { ASCIIArt } from "@/common/helpers/ASCIIArt";

const ASCII = `
         .---------------------o--------------o---o +1.5V               
         |                     |              |                         
         |                     |              |                         
        .-.         ||100n     |             .-.                        
        | |    .----||----.    |             | |                        
       100k    |    ||    |    |             | |1k                      
        '-'    |    ___   |  |<              '-'                        
         |     o---|___|--o--|                |                         
         |     |    1k       |\               |                         
         |   |/                |              |                         
         o---|                 |              |                         
         |   |>                |              |                         
         |     |               |              |                         
         |     |    \]         |     \]       |                         
         '-----)----|]---------o-----|]-------o                         
               |    /]+        |     /]+      |                         
               |    10µ       .-.    100µ     |                         
               |              | |             |                         
               |              | |47Ω          V ->                      
               |              '-'             -                         
               |               |              |                         
               '---------------o--------------o---o GND
`;

const LandingPage = () => {
  return (
<div className="text-white relative h-[calc(100vh-65px)] overflow-hidden">
  <div className="absolute inset-0 opacity-20 scale-150 flex items-center justify-center overflow-hidden">
    <ASCIIArt art={ASCII} />
  </div>

      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">Elevate Your Code Quality with AI-Powered Auditing</h1>
          <p className="text-xl text-gray-300 mb-8">Harness the power of AI to analyze your code, improve quality, and boost productivity.</p>
          <Link href="/pricing" className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300">
            Subscribe Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;