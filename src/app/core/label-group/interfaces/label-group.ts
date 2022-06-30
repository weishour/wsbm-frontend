import { Label } from "app/core/label/interfaces";

export interface LabelGroup {
  id: number;
  title: string;
  sort: number;
  labels: Label[];
}
