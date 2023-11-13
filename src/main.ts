import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as hbs from 'hbs';
import * as session from 'express-session';



// Import firebase-admin
import * as admin from 'firebase-admin';
import { ServiceAccount } from "firebase-admin";
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';


const adminConfig: ServiceAccount = {
  "projectId": process.env.FIREBASE_PROJECT_ID,
  "privateKey": process.env.FIREBASE_PRIVATE_KEY
    .replace(/\\n/g, '\n'),
  "clientEmail": process.env.FIREBASE_CLIENT_EMAIL,
};
// Initialize the firebase admin app
admin.initializeApp({
  credential: admin.credential.cert(adminConfig),
  databaseURL: "https://bettingapp-2581d-default-rtdb.firebaseio.com/", 
});
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  app.enableCors();
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1999900
      }
    }),
  );

  app.enableCors({
    origin: '*',
    methods: 'GET, PUT, POST, DELETE',
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useStaticAssets(join(__dirname, '..', 'uploads'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  hbs.registerPartials(join(__dirname, '..', 'views/partials'));
  hbs.registerPartials(join(__dirname, '..', 'views/layout'));
  app.setViewEngine('hbs');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  // Custom Handlebars helper
  hbs.registerHelper("list", function (context, options) {
    var ret = "<ul>";

    for (var i = 0, j = context.length; i < j; i++) {
      ret = ret + "<li>" + options.fn(context[i]) + "</li>";
    }

    return ret + "</ul>";
  });


  // const configService: ConfigService = app.get(ConfigService);

  await app.listen(2053);
}
bootstrap();
