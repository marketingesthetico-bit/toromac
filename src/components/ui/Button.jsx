import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const variants = {
  primary:
    'bg-toro-blue text-white hover:bg-toro-blue-light active:bg-toro-blue-dark focus-visible:ring-toro-blue/40',
  secondary:
    'bg-white text-toro-black border border-toro-black/10 hover:border-toro-black/30 hover:bg-toro-gray-cold focus-visible:ring-toro-black/20',
  outline:
    'bg-transparent text-white border border-white hover:bg-white hover:text-toro-black focus-visible:ring-white/40',
  ghost:
    'bg-transparent text-toro-black hover:bg-toro-gray-cold focus-visible:ring-toro-black/20',
};

const sizes = {
  sm: 'text-sm px-4 py-2 rounded-md gap-1.5',
  md: 'text-base px-6 py-3 rounded-lg gap-2',
  lg: 'text-base px-8 py-4 rounded-lg gap-2',
};

const base =
  'inline-flex items-center justify-center font-medium font-heading transition-colors duration-200 ease-out-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

export default function Button({
  as,
  to,
  href,
  variant = 'primary',
  size = 'md',
  withArrow = false,
  className = '',
  children,
  ...rest
}) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim();
  const inner = (
    <>
      {children}
      {withArrow && <ArrowRight className="h-4 w-4" aria-hidden />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {inner}
      </a>
    );
  }
  const Tag = as || 'button';
  return (
    <Tag className={cls} {...rest}>
      {inner}
    </Tag>
  );
}
