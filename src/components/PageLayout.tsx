interface PageLayoutProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageLayout({ title, description, children }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white px-8 py-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </header>
      {children && <section className="p-8">{children}</section>}
    </div>
  );
}
