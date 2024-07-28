import { Delivery } from "@src/app/deliveries/types/Delivery"
import { FailureDeliveryData } from "./FailureDeliveryData"
import { NeighborhoodDeliveryData } from "./NeighborhoodDeliveryData"
import { SuccessDeliveryData } from "./SuccessDeliveryData"
import { Status } from "@src/app/deliveries/types/Status"

export type ReportDataConfiguration = {
  data: Delivery[], 
  mapBuilder: Function, 
  report: Map<string, FailureDeliveryData | SuccessDeliveryData | NeighborhoodDeliveryData>,
  mapDeliveryStatusToReportField: {[key: string]: string | undefined},
  keys: string[],
  totalKey?: string
}