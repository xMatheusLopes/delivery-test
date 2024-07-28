import { Delivery } from "@src/app/deliveries/types/Delivery"
import { FailureDeliveryData } from "./FailureDeliveryData"
import { NeighborhoodDeliveryData } from "./NeighborhoodDeliveryData"
import { SuccessDeliveryData } from "./SuccessDeliveryData"

export type ReportDataConfiguration = {
  data: Delivery[], 
  mapBuilder: Function, 
  report: Map<string, FailureDeliveryData | SuccessDeliveryData | NeighborhoodDeliveryData>,
  mapDeliveryStatusToReportField: {[key: string]: string | undefined},
  keys: string[],
  totalKey?: string
}