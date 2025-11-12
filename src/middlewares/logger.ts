import { Express, NextFunction, Request, Response } from "express";

const getDateString = () => {
  const date = new Date();
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
};

export default (app: Express) => {
  // BEFORE
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`\u001b[1;36m[${getDateString()}] ${req.method} ${req.originalUrl}\u001b[0m`);
    next();
  });

  // RESPONSE BODY
  app.use((req: Request, res: Response, next: NextFunction) => {
    const oldSend = res.send;

    res.send = function (body?: any): Response {
      console.log('\u001b[1;36m', body, '\u001b[0m');
      return oldSend.call(this, body);
    };

    next();
  });

  // AFTER
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(
        `\u001b[1;32m[${getDateString()}]  ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms\u001b[0m`
      );
    });

    next();
  });
}
