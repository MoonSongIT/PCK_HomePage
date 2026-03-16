// 📁 파일 경로: components/common/PageHeader.tsx

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[var(--color-text-primary)]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-[var(--color-text-secondary)]">
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
