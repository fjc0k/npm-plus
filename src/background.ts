import umiRequest, {RequestOptionsInit} from 'umi-request'

export type IRequestOptions = RequestOptionsInit & {
  url: string,
  method: 'GET' | 'POST',
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
      ).then(sendResponse)
    }
    return true
  },
)
