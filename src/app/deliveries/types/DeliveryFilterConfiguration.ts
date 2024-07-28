import { Status } from "./Status";

export type DeliveryFilterConfiguration = {
  name: string; 
  status: Status | ""; 
  page: number; 
  pageSize: number;
}