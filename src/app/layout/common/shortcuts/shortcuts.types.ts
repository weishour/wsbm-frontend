export interface Shortcut {
  // 唯一ID
  id: string;
  // 标签
  label: string;
  // 描述
  description?: string;
  // 图标
  icon: string;
  // 链接
  link: string;
  // 是否使用Router解析链接
  useRouter: boolean;
}
