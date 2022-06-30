import { LabelGroup } from "app/core/label-group";

export interface Label {
  id: number;
  menuId: string;
  groupId: number;
  group: LabelGroup;
  iconTitle: string;
  iconType: string;
  iconName: string;
  address: string;
  title: string;
  description: string;
  sort: number;
}
