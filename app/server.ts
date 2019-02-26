import App from './app';
import { JobsController } from './jobs/jobs-controller';

const app = new App([new JobsController()], 5000);

app.listen();
