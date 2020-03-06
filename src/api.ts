import {getTypesPackageName} from './utils'
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
    main?: string,
    types?: string,
    typings?: string,
  }>({
    method: 'GET',
    url: `https://unpkg.com/${packageName}/package.json`,
  }))
  if (!getPackageInfoErr) {
    if (getPackageInfoRes.types || getPackageInfoRes.typings) {
      return PackageTypesState.Included
    }
    if (getPackageInfoRes.main) {
      const main = getPackageInfoRes.main
        .replace(/^\.?\/+/, '')
        .replace(/\.m?js$/i, '')
      const [getMainTypesErr] = await result(request({
        method: 'GET',
        url: `https://unpkg.com/${packageName}/${main}.d.ts`,
      }))
      if (!getMainTypesErr) {
        return PackageTypesState.Included
      }
    }
  }
  const [getTypesPackageErr] = await result(request({
    method: 'GET',
    url: `https://www.npmjs.com/package/${getTypesPackageName(packageName)}`,
  }))
  return getTypesPackageErr
    ? PackageTypesState.Missing
    : PackageTypesState.DefinitelyTyped
}
