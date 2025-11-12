import { Express } from "express";
import fs from "fs";
import path from "path";

const camelToKebab = (str: string): string => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

export const configureRoutes = (app: Express) => {
  const routesPath = __dirname;
  const routeFiles = fs.readdirSync(routesPath);

  routeFiles.forEach((file) => {
    if (file === 'index.ts' || !file.endsWith('.ts')) {
      return;
    }

    try {
      const routeName = path.basename(file, '.ts');
      const routePath = camelToKebab(routeName);
      const routeModule = require(`./${routeName}`);
      const router = routeModule.default || routeModule;

      app.use(routePath, router);

      console.log(`✓ Registered route: ${routeName} -> ${routePath}`);

    } catch (error) {
      console.error(`✗ Failed to load route file: ${file}`, error);
    }
  });
};