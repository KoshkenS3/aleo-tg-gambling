import {Avatar, NextUIProvider} from "@nextui-org/react";
import { Navbar } from "./navbar";

import './App.css'
import { configureConnection } from "@puzzlehq/sdk";
import { Claim } from "./claim";

export const App = () => {
  configureConnection({
    dAppName: "Casino",
    dAppDescription: "Claim wins",
    dAppUrl: "https://wheresalex.puzzle.online",
    dAppIconURL: "https://wheresalex.puzzle.online/alex_head.png"
  });

  return (
    <NextUIProvider>
      <main className="dark text-foreground bg-background">
        <Navbar />
        <div>
          {new Array(15).fill(0).map((_, i) => <img key={i + "football"} src="https://www.emojiall.com/images/60/telegram/26bd.gif" style={{ width: 30, height: 30, position: 'absolute', left: Math.random() * window.innerWidth, top: Math.random() * window.innerHeight }} alt="football" />)}
          {new Array(15).fill(0).map((_, i) => <img key={i + "basket"} src="https://www.emojiall.com/images/60/telegram/1f3c0.gif" style={{ width: 30, height: 30, position: 'absolute', left: Math.random() * window.innerWidth, top: Math.random() * window.innerHeight }} alt="basket" />)}
          {new Array(15).fill(0).map((_, i) => <img key={i + "ulibaka"} src="https://www.emojiall.com/images/120/telegram/1f600.gif" style={{ width: 30, height: 30, position: 'absolute', left: Math.random() * window.innerWidth, top: Math.random() * window.innerHeight }} alt="ulibaka" />)}
          {new Array(15).fill(0).map((_, i) => <img key={i + "love"} src="https://www.emojiall.com/images/120/telegram/1f970.gif" style={{ width: 30, height: 30, position: 'absolute', left: Math.random() * window.innerWidth, top: Math.random() * window.innerHeight }} alt="love" />)}
          {/* {new Array(10).fill(0).map((_, i) => <img key={i + "slot"} src="https://www.emojiall.com/images/60/telegram/1f3b0.gif" style={{ width: 50, height: 50, position: 'absolute', left: Math.random() * window.screen.width, top: Math.random() * window.screen.width }} alt="slot" />)} */}
          
        </div>
        <div style={{ width: 'calc(100vw)', height: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Claim />
        </div>
      </main>
    </NextUIProvider>
  );
}