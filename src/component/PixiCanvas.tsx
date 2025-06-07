import React, { useEffect, useRef } from "react";
import {
  Application,
  Sprite,
  Container,
  DisplacementFilter,
  Assets,
  Texture,
} from "pixi.js";

const PixiCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const app = new Application({
      resizeTo: window,
      backgroundColor: 0x1099bb,
    });

    if (canvasRef.current) {
      canvasRef.current.appendChild(app.view as unknown as Node);
    }

    const fishes: Sprite[] = [];

    async function preload() {
      await Assets.load([
        "https://pixijs.com/assets/tutorials/fish-pond/pond_background.jpg",
        "https://pixijs.com/assets/tutorials/fish-pond/fish1.png",
        "https://pixijs.com/assets/tutorials/fish-pond/fish2.png",
        "https://pixijs.com/assets/tutorials/fish-pond/fish3.png",
        "https://pixijs.com/assets/tutorials/fish-pond/fish4.png",
        "https://pixijs.com/assets/tutorials/fish-pond/fish5.png",
        "https://pixijs.com/assets/tutorials/fish-pond/wave_overlay.png",
        "https://pixijs.com/assets/tutorials/fish-pond/displacement_map.png",
      ]);
    }

    async function setup() {
      const bgTexture = Assets.get("https://pixijs.com/assets/tutorials/fish-pond/pond_background.jpg") as Texture;
      const background = new Sprite(bgTexture);
      background.width = window.innerWidth;
      background.height = window.innerHeight;
      app.stage.addChild(background as any);

      for (let i = 0; i < 20; i++) {
        const fishNum = (i % 5) + 1;
        const fishTexture = Assets.get(`https://pixijs.com/assets/tutorials/fish-pond/fish${fishNum}.png`) as Texture;
        const fish = new Sprite(fishTexture);
        fish.x = Math.random() * window.innerWidth;
        fish.y = Math.random() * window.innerHeight;
        (fish as any).vx = 0.5 + Math.random();
        fishes.push(fish);
        app.stage.addChild(fish as any);
      }

      const overlayContainer = new Container();
      const overlayTexture = Assets.get("https://pixijs.com/assets/tutorials/fish-pond/wave_overlay.png") as Texture;
      const overlay = new Sprite(overlayTexture);
      overlay.width = window.innerWidth;
      overlay.height = window.innerHeight;
      overlayContainer.addChild(overlay as any);
      app.stage.addChild(overlayContainer as any);

      const displacementTexture = Assets.get("https://pixijs.com/assets/tutorials/fish-pond/displacement_map.png") as Texture;
      const displacementSprite = new Sprite(displacementTexture);
      displacementSprite.texture.baseTexture.wrapMode = 10497; // REPEAT
      const displacementFilter = new DisplacementFilter(displacementSprite);
      app.stage.addChild(displacementSprite as any);
      app.stage.filters = [displacementFilter];

      app.ticker.add((delta) => {
        for (const fish of fishes) {
          fish.x += (fish as any).vx * delta;
          if (fish.x > window.innerWidth) fish.x = -fish.width;
        }
        displacementSprite.x += 1 * delta;
        displacementSprite.y += 1 * delta;
      });
    }

    preload().then(() => {
      if (app.stage) {
        setup();
      }
    });

    return () => {
      app.destroy(true, { children: true, texture: true, baseTexture: true });
    };
  }, []);

  return <div ref={canvasRef} style={{ width: "100%", height: "100vh" }} />;
};

export default PixiCanvas;
