const variants = {
  default: 'bg-toro-gray-cold text-toro-black',
  blue: 'bg-toro-blue/10 text-toro-blue',
  outline: 'border border-toro-black/15 text-toro-gray-mid',
  dark: 'bg-toro-black text-white',
};

export default function Badge({ variant = 'default', className = '', children, ...rest }) {
  return (
    <span
      className={`inline-flex items-center text-[11px] tracking-wider uppercase font-medium px-2.5 py-1 rounded-full ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
