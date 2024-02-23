"use strict";
import { useErrorsStore } from "../stores/errors";
import RequestMethodEnum from "../Enums/RequestMethodEnum";
const env = import.meta.env;

class ApiRequest {
  getBaseUrl(url) {
    const baseUrl = env.VITE_BASE_BACKEND_URL;
    return baseUrl + url;
  }

  getWebSocketUrl(url) {
    const baseUrl = env.VITE_BASE_WEB_SOCKET_URL;
    return baseUrl + url;
  }

  getHeaders(headers, isFile) {
    const default_headers = {
      accept: "application/json",
      "Content-Type": "application/json",
    };
    if (headers !== undefined) {
      for (const [key, value] of Object.entries(headers)) {
        default_headers[key] = value;
      }
    }
    if (!isFile) {
      default_headers["Content-Type"] = "application/json;charset=UTF-8";
    }
    return default_headers;
  }

  getParams(payload, isFile) {
    const { method, body } = payload;
    if (["POST", "PUT", "PATCH", "DELETE"].indexOf(method) >= 0) {
      payload.body = body;
      if (!isFile) {
        payload.body = JSON.stringify(payload.body);
      }
    } else {
      payload.params = body;
      delete payload.data;
    }
    return payload;
  }

  setParams(filter) {
    let i = 0;
    let params = "";
    for (const f in filter) {
      if (filter[f] !== "") {
        if (i === 0) {
          params = "?" + f + "=" + filter[f];
        } else {
          params = params + "&" + f + "=" + filter[f];
        }
        i++;
      }
    }
    return params;
  }

  async request(options) {
    const params = options.params;
    let url = this.getBaseUrl(options.url) || "";
    if (params || params !== undefined) url = url + params;
    const method = options.method || RequestMethodEnum.GET;
    const redirect = options.redirect;
    const referrerPolicy = options.referrerPolicy;
    const body = options.body;
    const credentials = options.credentials || "include";
    const headers = this.getHeaders();
    const errorsStore = useErrorsStore();
    try {
      const res = await fetch(url, {
        mode: "cors",
        method,
        credentials,
        headers,
        redirect,
        referrerPolicy,
        body: JSON.stringify(body),
      });
      const data = await res.json();
      // if request is not succeeded
      if (!res.ok || data.status !== "ok") {
        console.log( data.message )
        let err = errorsStore.createErr("Warning", data.message, "bg-warning");
        errorsStore.addErr(err);
        // TODO route to 401 & 404 & 500 page
      }
      // if request is succeeded
      return data;
    } catch (e) {
      console.error(e);
      errorsStore.addServerErr();
      // TODO route to 500 page
    }
  }
}

const api_request = new ApiRequest();
export default api_request;
