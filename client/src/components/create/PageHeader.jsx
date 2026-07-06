export default function PageHeader({ title, subtitle }) {
  return (
    <header className="page-header">
      <h1 className="page-header__title">{title}</h1>
      <p className="page-header__sub">{subtitle}</p>
    </header>
  );
}
