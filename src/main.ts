import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as hbs from 'hbs';
import * as session from 'express-session';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  // Enable session middleware
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

  // Enable CORS with specified configuration
  app.enableCors({
    origin: '*',
    methods: 'GET, PUT, POST, DELETE',
  });

  // Set up static assets and view engine (assuming you're using Handlebars as the view engine)
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  hbs.registerPartials(join(__dirname, '..', 'views/partials'));
  hbs.registerPartials(join(__dirname, '..', 'views/layout'));
  app.setViewEngine('hbs');

  // Custom Handlebars helper
  hbs.registerHelper("list", function (context, options) {
    var ret = "<ul>";

    for (var i = 0, j = context.length; i < j; i++) {
      ret = ret + "<li>" + options.fn(context[i]) + "</li>";
    }

    return ret + "</ul>";
  });

  // Start listening on port 3000
  await app.listen(3000);
}
bootstrap();
