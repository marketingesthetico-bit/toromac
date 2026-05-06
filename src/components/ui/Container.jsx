export default function Container({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag className={`max-w-7xl mx-auto px-6 lg:px-8 ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
