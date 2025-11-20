function Footer() {
  return (
    <footer className="bg-black h-18 flex items-center justify-center max-w-8xl mx-auto">
      <div className="text-center">
        <p className="text-m font-bold text-white">Surgical App</p>

        <p className="text-sm text-gray-400">
          {" "}
          Copyright &copy; {new Date().getFullYear()} JK Online Surgery. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
export default Footer;
