/**
 * Landing Page Footer
 */

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-4">Héritage</h3>
          <p className="text-slate-400 text-sm">Préservez et partagez les histoires qui façonnent votre famille.</p>
        </div>
        <div>
          <h4 className="font-bold mb-4">À propos</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="#" className="hover:text-white transition">Notre histoire</a></li>
            <li><a href="#" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Légal</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="#" className="hover:text-white transition">Conditions</a></li>
            <li><a href="#" className="hover:text-white transition">Confidentialité</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Suivez-nous</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="#" className="hover:text-white transition">Twitter</a></li>
            <li><a href="#" className="hover:text-white transition">Facebook</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
        <p>&copy; 2024 Héritage. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
