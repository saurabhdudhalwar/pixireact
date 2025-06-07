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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fishes: Sprite[] = [];

  useEffect(() => {
    const app = new Application({
      resizeTo: window,
      backgroundColor: 0x1099bb,
    });

    if (canvasRef.current) {
      canvasRef.current.appendChild(app.view as unknown as Node);
    }

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

    function setup() {
      const bgTexture = Assets.get("https://pixijs.com/assets/tutorials/fish-pond/pond_background.jpg") as Texture;
      const background = new Sprite(bgTexture);
      background.width = app.screen.width;
      background.height = app.screen.height;
      app.stage.addChild(background as any);

      for (let i = 0; i < 20; i++) {
        const fishNum = (i % 5) + 1;
        const fishTexture = Assets.get(`https://pixijs.com/assets/tutorials/fish-pond/fish${fishNum}.png`) as Texture;
        const fish = new Sprite(fishTexture);
        fish.x = Math.random() * app.screen.width;
        fish.y = Math.random() * app.screen.height;
        (fish as any).vx = 0.5 + Math.random();
        fishes.push(fish);
        app.stage.addChild(fish as any);
      }

      const overlayContainer = new Container();
      const overlayTexture = Assets.get("https://pixijs.com/assets/tutorials/fish-pond/wave_overlay.png") as Texture;
      const overlay = new Sprite(overlayTexture);
      overlay.width = app.screen.width;
      overlay.height = app.screen.height;
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
          if (fish.x > app.screen.width) fish.x = -fish.width;
        }
        displacementSprite.x += 1 * delta;
        displacementSprite.y += 1 * delta;
      });
    }

    preload().then(setup);

    return () => {
      app.destroy(true, { children: true, texture: true, baseTexture: true });
    };
  }, [fishes]);

  return <div ref={canvasRef} style={{ width: "100%", height: "100vh" }} />;
};

export default PixiCanvas;
