export interface SwaggerDocumentOption {
  include?: Function[];
  extraModels?: Function[];
  ignoreGlobalPrefix?: boolean;
  deepScanRoutes?: boolean;
  operationIdFactory?: (controlKey: string, methodKey: string) => string;
}