import Job from './job';

export default class Oportunity extends Job {
  brand: String | undefined;
  benefits: Array<string> | undefined;
  createdAt: String | undefined;
  workinHours: String | undefined;
  salary: String | undefined;
  location: String | undefined;
  contract: String | undefined;
}
