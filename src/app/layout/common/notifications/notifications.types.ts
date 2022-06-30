export interface Notification {
  // 唯一ID
  id: string;
  // 图标名称
  icon?: string;
  // 图像
  image?: string;
  // 标题
  title?: string;
  // 描素
  description?: string;
  // 时间
  time: string;
  // 链接
  link?: string;
  // 是否使用Router解析链接
  useRouter?: boolean;
  // 是否标记为已读
  read: boolean;
}
