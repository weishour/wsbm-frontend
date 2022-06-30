import { WsNavigationItem } from '@ws/components/navigation';
import { Label } from 'app/core/label';
import { LabelGroup } from 'app/core/label-group';

export interface DrawerLabelData {
  action: string;
  activeNavigation: WsNavigationItem;
  labelGroups: LabelGroup[];
  labelGroup: LabelGroup;
  label?: Label;
  count: number;
  currentColor: string;
}
