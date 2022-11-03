import { SetMetadata } from "@nestjs/common";

export const NoCache = () => SetMetadata('noCaching', true);