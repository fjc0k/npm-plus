import {IBackgroundRequest, IRequestOptions, IRequestReturn} from './background'
import {result} from 'vtils'

async function request<TResponse>(options: IRequestOptions): Promise<TResponse> {
  const res = await new Promise<IRequestReturn>(resolve => {
    chrome.runtime.sendMessage(
      {
        type: 'httpRequest',
        options: options,
      } as IBackgroundRequest,
      resolve,
    )
  })
  if (res.error) {
    throw 'request error'
  }
  return res.response
}

export enum PackageTypesState {
  'Included',
  'DefinitelyTyped',
  'Missing',
  'Pending',
}

export async function detectPackageTypesState(packageName: string): Promise<PackageTypesState> {
  const [getPackageInfoErr, getPackageInfoRes] = await result(request<{
    types?: string,
    typing?: string,
  }>({
    method: 'GET',
    url: `https://unpkg.com/${packageName}/package.json`,
  }))
  if (!getPackageInfoErr && (getPackageInfoRes.types || getPackageInfoRes.typing)) {
    return PackageTypesState.Included
  }
  const [getTypesPackageErr] = await result(request({
    method: 'GET',
    url: `https://www.npmjs.com/package/@types/${packageName}`,
  }))
  return getTypesPackageErr
    ? PackageTypesState.Missing
    : PackageTypesState.DefinitelyTyped
}
