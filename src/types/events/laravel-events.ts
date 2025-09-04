import { PlatformResource } from "../resources/platform-data";

export type ProcessPlatformEvent = { platform: Omit<PlatformResource, 'data'> }