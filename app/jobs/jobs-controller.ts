import * as express from 'express';
import { fetch } from 'fetch-h2';
import { IController } from '../utils/IController';
import Job from './job';
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
    const queryString = '?page=1&limit=10';

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
        title: element.title,
        description: element.short_description,
        image: `https://apigw.prod.empregoligado.net/b2c-svc/api/static-map?center=-${
          element.address.coordinates.latitude
        },${
          element.address.coordinates.longitude
        }&zoom=16&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:${String(
          element.address.coordinates.company_name
        )
          .charAt(0)
          .toUpperCase()}%7C${element.address.coordinates.latitude},${
          element.address.coordinates.longitude
        }&key=AIzaSyD0pbg9JRocVpv-8qJDbv5aQA7hFdT7XJA`
      };
    });
    return result;
  }
}
