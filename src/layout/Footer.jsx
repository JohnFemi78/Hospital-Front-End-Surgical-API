function Footer() {
  return (
    <footer className="w-full bg-black py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-lg font-bold text-white">Surgical App</p>

        <p className="text-sm text-gray-400 mt-1">
          Copyright &copy; {new Date().getFullYear()} JK Online Surgery. 
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
