import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors"; //other not found
import morgan from "morgan";
import { limiter } from "./middlewares/ratelimiter";
import healthRouter from "./routes/v1/health";
import authRouter from "./routes/v1/auth";
import userRouth from "./routes/v1/admin/user";
import profileRouth from "./routes/v1/api/user";
import { auth } from "./middlewares/auth";
import cookieParser from "cookie-parser"; //for middleware
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware, { handle } from "i18next-http-middleware";
import path from "path"; //for i18next multilanguage

export const app = express();

//save for hacker

var whitelist = ["http://example1.com", "http://localhost:5173"];
var corsOptions = {
  origin: function (
    origin: any,
    callback: (err: Error | null, origin?: any) => void
  ) {
    if (!origin) return callback(null, true); //allow request for postman

    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, //Allow cookies or authorization header
};

//for middleware for expressjs
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression()); //for zip
app.use(limiter); //for create middlewars for ratelimiter.ts
app.use(express.static("public")); //link for style css input for upper page
app.use(cookieParser());
app.use(cors());

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    backend: {
      debug: true,
      loadPath: path.join(
        process.cwd(),
        "src/locales",
        "{{lng}}",
        "{{ns}}.json"
      ),
    },
    detection: {
      order: ["querystring", "cookie"],
      caches: ["cookie"],
    },
    fallbackLng: "en",
    preload: ["en", "mm"],
  });
app.use(middleware.handle(i18next));

app.use(healthRouter); //for create controller for healthcontroller.ts
app.use(authRouter);
// app.use(userRouth);  //not for middleware in admin
app.use(auth, userRouth); //use for middleware admin

//catch for error
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || "Server error..";
  const code = error.code || "Error code";
  res.status(status).json({ message, error: code });
});
app.use(profileRouth); //for this router put for under i18next
