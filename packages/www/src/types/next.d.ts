
export interface ServerSideComponentProp<
  Params,
  SearchParams = undefined,
> {
  params: Params;
  searchParams: SearchParams;
}
