import { HttpContext, HttpHeaders } from "@angular/common/http";

export type ObjectHttpHeaders = { [header: string]: string | string[] };
export type WsHttpHeaders = HttpHeaders | ObjectHttpHeaders;
export type HttpObserve = 'body' | 'events' | 'response';
export type WsResponseType = 'arraybuffer' | 'blob' | 'json' | 'text';

export type WsHttpOptions = {
  headers?: WsHttpHeaders;
  observe?: HttpObserve;
  reportProgress?: boolean;
  responseType?: WsResponseType;
  withCredentials?: boolean;
  context?: HttpContext;
};
