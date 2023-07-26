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
  app.enableCors();
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      cookie:{
        maxAge:1999900
      }
    }),
  );
  app.enableCors({
    origin: '*',
    methods: 'GET, PUT, POST, DELETE',
  });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  hbs.registerPartials(join(__dirname, '..', 'views/partials'));
  hbs.registerPartials(join(__dirname, '..', 'views/layout'));
  app.setViewEngine('hbs');
  
hbs.registerHelper("list", function(context, options) {
  var ret = "<ul>";

  for (var i = 0, j = context.length; i < j; i++) {
    ret = ret + "<li>" + options.fn(context[i]) + "</li>";
  }

  return ret + "</ul>";
});

  await app.listen(3000);
}
bootstrap();
