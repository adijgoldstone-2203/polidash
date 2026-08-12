const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  console.log("Launching browser to inspect map feature properties...");
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', (msg) => {
    if (msg.text().includes('FEATURE_PROPS:')) {
      console.log(msg.text());
    }
  });

  try {
    await page.goto('http://localhost:5173/#/map', { 
      waitUntil: 'networkidle2',
      timeout: 10000 
    });
    
    // Inject a listener on map mousemove that logs features to the console
    await page.evaluate(() => {
      // Access the MapLibre map instance via a global hook or wait for it
      // Let's hook into the map canvas directly or wait a bit
      setTimeout(() => {
        const mapEl = document.querySelector('.maplibregl-canvas');
        if (mapEl) {
          console.log("FEATURE_PROPS: Map canvas found, simulating mousemove...");
        }
      }, 1000);
    });

    // Let the map load
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulate mouse move over the center of the map canvas
    // Canvas center is around x: 300, y: 300
    await page.mouse.move(300, 300);
    await new Promise(resolve => setTimeout(resolve, 500));
    await page.mouse.move(350, 350); // Try a different spot
    await new Promise(resolve => setTimeout(resolve, 500));
    await page.mouse.move(400, 250); // Another spot
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Let's print out what properties the actual map layers have by executing queryRenderedFeatures
    const props = await page.evaluate(() => {
      // Find the MapLibre map instance. React usually stores it or we can check window
      // Since mapInstanceRef is not global, let's query the features directly using maplibre GL's canvas or state if available.
      // Wait, is mapInstanceRef stored globally? Let's check.
      // If not, we can find it by inspecting the __reactFiber$ properties on the DOM node!
      const mapDiv = document.querySelector('.w-full.h-full');
      if (!mapDiv) return "Map div not found";
      
      // Look for react instance key
      const reactKey = Object.keys(mapDiv).find(key => key.startsWith('__reactFiber$') || key.startsWith('__reactContainer$'));
      if (!reactKey) return "React internal key not found";
      
      // Traverse up to find ElectionsMap component state or ref
      let fiber = mapDiv[reactKey];
      while (fiber) {
        if (fiber.memoizedState && fiber.memoizedState.memoizedState) {
          // Let's scan state hooks or ref hook
        }
        // Let's check refs
        if (fiber.ref && fiber.ref.current && fiber.ref.current.version) {
          // Found MapLibre Map instance!
          const map = fiber.ref.current;
          const features = map.queryRenderedFeatures({ x: 300, y: 300 }, { layers: ['yishuvim-layer'] });
          if (features.length > 0) {
            return {
              spot1: {
                layer: features[0].layer.id,
                properties: features[0].properties
              }
            };
          }
          // Try a few points in a grid to find features
          for (let x = 100; x < 500; x += 50) {
            for (let y = 100; y < 500; y += 50) {
              const feats = map.queryRenderedFeatures({ x, y }, { layers: ['yishuvim-layer'] });
              if (feats.length > 0) {
                return {
                  found: true,
                  x, y,
                  properties: feats[0].properties
                };
              }
            }
          }
          return "No features found in yishuvim-layer";
        }
        // Also check child/sibling fiber for ref
        if (fiber.child) {
          let child = fiber.child;
          while (child) {
            if (child.ref && child.ref.current && child.ref.current.version) {
              const map = child.ref.current;
              // Found map
              for (let x = 100; x < 500; x += 50) {
                for (let y = 100; y < 500; y += 50) {
                  const feats = map.queryRenderedFeatures({ x, y }, { layers: ['yishuvim-layer'] });
                  if (feats.length > 0) {
                    return {
                      found: true,
                      x, y,
                      properties: feats[0].properties
                    };
                  }
                }
              }
            }
            child = child.sibling;
          }
        }
        fiber = fiber.return;
      }
      return "Map instance not found in React tree";
    });

    console.log("FEATURE_PROPS RESULT:", JSON.stringify(props, null, 2));
  } catch (e) {
    console.error("Failed to query features:", e.message);
  }

  await browser.close();
})();
