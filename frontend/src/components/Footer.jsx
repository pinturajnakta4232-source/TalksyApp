export default function Footer() {
  return (
    <footer className="footer">
      <div className="logo" style={{ fontSize: 18, marginBottom: 6 }}>
        Pinzo
      </div>
      <p>Shop More, Pay Less</p>
      <p>&copy; {new Date().getFullYear()} Pinzo. All rights reserved.</p>
    </footer>
  );
}
