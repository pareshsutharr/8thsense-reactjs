import { Link } from "react-router-dom";
import { Instagram, Twitter, Mail } from "lucide-react";
import { BrandMark } from "@/components/common/BrandMark";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-12 mt-auto">
      <div className="page-container grid gap-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link to="/" className="mb-4 flex items-center">
            <BrandMark className="w-[180px]" />
          </Link>
          <p className="text-sm text-slate-500 mb-6 max-w-xs">
            Premium photography, videography, and social media content for modern brands and discerning clients.
          </p>
          <div className="flex gap-4 text-slate-400">
            <a href="#" className="hover:text-slate-900 transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-slate-900 transition-colors"><Twitter size={20} /></a>
            <a href="#" className="hover:text-slate-900 transition-colors"><Mail size={20} /></a>
          </div>
        </div>
        
        <div>
          <h3 className="font-bold text-slate-900 mb-4 uppercase text-sm tracking-wider">Explore</h3>
          <ul className="flex flex-col gap-2 text-sm text-slate-500">
            <li><Link to="/portfolio" className="hover:text-slate-900 transition-colors">Portfolio</Link></li>
            <li><Link to="/services" className="hover:text-slate-900 transition-colors">Services</Link></li>
            <li><Link to="/gallery" className="hover:text-slate-900 transition-colors">Community Gallery</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold text-slate-900 mb-4 uppercase text-sm tracking-wider">Studio</h3>
          <ul className="flex flex-col gap-2 text-sm text-slate-500">
            <li><Link to="/studio" className="hover:text-slate-900 transition-colors">Client Access</Link></li>
            <li><Link to="/login" className="hover:text-slate-900 transition-colors">Sign In</Link></li>
            <li><Link to="/register" className="hover:text-slate-900 transition-colors">Register</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold text-slate-900 mb-4 uppercase text-sm tracking-wider">Contact</h3>
          <ul className="flex flex-col gap-2 text-sm text-slate-500">
            <li>hello@8thsense.com</li>
            <li>+1 (555) 123-4567</li>
            <li className="mt-2">
              <Link to="/contact" className="text-slate-900 font-semibold hover:underline">Get in touch &rarr;</Link>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="page-container mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} 8thSense Production. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="#" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
