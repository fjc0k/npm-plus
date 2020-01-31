import {IBackgroundRequest, IRequestOptions} from './background'

async function request<TResponse>(options: IRequestOptions): Promise<TResponse> {
  const res = await new Promise(resolve => {
    chrome.runtime.sendMessage(
      {
        type: 'httpRequest',
        options: options,
      } as IBackgroundRequest,
      resolve,
    )
  })
  return res as any
}

export function getD() {
  return request({
    url: 'dd',
    method: 'GET',
  })
}
