export function getTypesPackageName(packageName: string): string {
  return `@types/${packageName.replace(/^@([^/]+)\//, '$1__')}`
}
