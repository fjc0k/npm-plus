import umiRequest, {RequestOptionsInit} from 'umi-request'

export type IRequestOptions = RequestOptionsInit & {
  url: string,
  method: 'GET' | 'POST',
}

export type IRequestReturn = {
  error: boolean,
  response: any,
}

export type IBackgroundRequest = {
  type: 'httpRequest',
  options: IRequestOptions,
}

chrome.runtime.onMessage.addListener(
  (request: IBackgroundRequest, _, sendResponse) => {
    if (request.type === 'httpRequest') {
      umiRequest(
        request.options.url,
        {
          getResponse: false,
          ...request.options,
        },
      ).then(
        res => sendResponse({
          error: false,
          response: res,
        } as IRequestReturn),
        err => sendResponse({
          error: true,
          response: err && err.response,
        } as IRequestReturn),
      )
    }
    return true
  },
)
