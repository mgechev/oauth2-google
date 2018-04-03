const opn = require('opn');
import { post } from 'request';
import { parse } from 'url';
import * as express from 'express';

const RedirectURI = 'http://localhost:7361';
const OAuth2TokenURL = 'https://www.googleapis.com/oauth2/v4/token';

export interface Config {
  clientId: string;
  clientSecret: string;
  scope: string;
}

export const auth = (config: Config) => {
  const OAuth2CodeURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
    config.clientId
  }&redirect_uri=${RedirectURI}&response_type=code&scope=${config.scope}&code_challenge_method=plain`;

  opn(OAuth2CodeURL).then((cp: any) => cp.kill());

  return new Promise(listen);
};

const listen = (resolve: Function, reject: Function) => {
  const app = express();

  app.get('/', (req, res) => {
    const params = parse(req.url, true);
    const { code, error } = params.query;
    if (error) {
      reject(error);
      server.close();
    } else {
      post(
        OAuth2TokenURL,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: encodeURI(
            `client_id=${ClientID}&client_secret=${ClientSecret}&redirect_uri=${RedirectURI}&grant_type=authorization_code&code=${code}`
          )
        },
        (error, response) => {
          if (error) {
            reject(error);
            server.close();
          } else {
            let body: null | string = null;
            try {
              body = JSON.parse(response.body);
            } catch (e) {
              reject(e);
              server.close();
              return;
            }
            resolve(body);
            server.close();
          }
        }
      );
    }
    res.end();
  });
  const server = app.listen(7361);
};

const ClientID = '329457372673-hda3mp2vghisfobn213jpj8ck1uohi2d.apps.googleusercontent.com';
const ClientSecret = '4camaoQPOz9edR-Oz19vg-lN';
const Scope = 'https://www.googleapis.com/auth/analytics.readonly';

auth({
  clientId: ClientID,
  clientSecret: ClientSecret,
  scope: Scope
}).then(
  res => {
    console.log(res);
  },
  err => {
    console.error(err);
  }
);
