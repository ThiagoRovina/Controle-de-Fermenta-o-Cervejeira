interface IconImageProps {
  src: string
  alt?: string
  size?: number
  className?: string
}

export default function IconImage({ src, alt = '', size = 16, className = '' }: IconImageProps) {
  return <img className={`inline-block shrink-0 object-contain ${className}`} src={src} alt={alt} aria-hidden={alt ? undefined : true} style={{ width: size, height: size }} />
}
