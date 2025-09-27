interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`shadow-3xl overflow-clip rounded-md bg-white p-2 shadow-gray-900/25 ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
