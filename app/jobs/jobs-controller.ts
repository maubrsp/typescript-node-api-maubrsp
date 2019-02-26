import * as express from 'express';
import { fetch } from 'fetch-h2';
import { IController } from '../utils/IController';
import Job from './jobs';
export class JobsController implements IController {
  public path: string = '/jobs';
  public router: express.Router = express.Router();
  private externalApiUrl: string =
    'https://apigw.qa.empregoligado.net/applicant/api/v1/jobs';

  private headers: any = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization:
        'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6OTg3NjU0MzIxLCJyb2xlX3R5cGUiOiJDQU5ESURBVEUifQ.07DIULD4B4GJUQO1-XFIaaLAUOHcSGBCmLWYofhJYMA'
    }
  };

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.getAllJobs);
    this.router.get(this.path + '/:id', this.getJobById);
  }

  getAllJobs = (request: express.Request, response: express.Response) => {
    const queryString = '?page=2&limit=3';

    this.load(this.externalApiUrl + queryString, this.headers)
      .then(
        res => {
          return this.simplifyAllJobs(res.collection._embedded);
        },
        error => {
          response.send(error);
        }
      )
      .then(res => {
        response.send(res);
      })
      .catch(error => {
        response.send(error);
      });
  };

  getJobById = (request: express.Request, response: express.Response) => {
    this.load(this.externalApiUrl + '/' + request.params.id, this.headers)
      .then(
        res => {
          response.send(res);
        },
        error => {
          response.send(error);
        }
      )
      .catch(error => {
        response.send(error);
      });
  };

  async load(url: string, headers: any) {
    const response = await fetch(url, headers);
    const responseJson = await response.json();
    return responseJson;
  }

  async simplifyAllJobs(itens: Array<any>) {
    const result = itens.map(element => {
      return <Job>{
        title: element.short_description,
        description: element.description
      };
    });
    return result;
  }
}
