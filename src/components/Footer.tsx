export default function Footer() {
  return (
    <footer className="py-8 border-t border-border mt-auto">
      <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Nayan Kuikel. Built with precision & architectural elegance.</p>
      </div>
    </footer>
  );
}
