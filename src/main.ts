import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { server } from './config';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        bodyParser: false
    });

    app.use((req: any, res: any, next: any) => {
        if (req.path.indexOf('/webhooks/stripe') === 0) {
            return bodyParser.raw({type: 'application/json'})(req, res, next);
        }
        bodyParser.json()(req, res, next);
    });
    app.use(cors());
    app.listen(server.port, () => {
        // tslint:disable-next-line: no-console
        console.log('%s: Node server started on %s ...', new Date(), server.port);
    });
}
bootstrap();
