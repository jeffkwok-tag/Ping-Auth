// Copyright 2018 Ping Identity
//
// Licensed under the MIT License (the "License"); you may not use this file
// except in compliance with the License.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
  AuthorizationConfig,
  GeneralEnvironmentInfo,
} from "../app/authorization_config";

export const environment: AuthorizationConfig & GeneralEnvironmentInfo = {
  production: false,
  issuer_uri: "https://auth.pingone.ca/662705cd-75fd-4eb2-992a-d5ad63567e3e/as",
  client_id: "7690b91f-b39f-461b-9638-9f837ca99ea9",
  redirect_uri: "https://localhost:4200/callback",
  client_secret:
    "NKDtdUQ.e0PPwE1q78RWxmQXRE5xGylQpoOqT-ZmLepwX_L.Y7V~4XHG33uklr8f",
  extras: {
    // prompt: "consent",
    // access_type: "offline",
  },
};
