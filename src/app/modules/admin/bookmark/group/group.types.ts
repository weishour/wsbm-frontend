import { WsNavigationItem } from '@ws/components/navigation';
import { LabelGroup } from 'app/core/label-group';

export interface DialogGroupData {
  action: string;
  activeNavigation: WsNavigationItem;
  labelGroup: LabelGroup;
  count: number;
}
