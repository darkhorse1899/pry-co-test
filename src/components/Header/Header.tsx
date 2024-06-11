import { LucidePlus } from 'lucide-react';

import useCalcStore from '@/store/useCalcStore';

const Header = () => {
  const { createFormula } = useCalcStore();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <a href="#" className="flex items-center py-4 px-2">
                <span className="font-semibold text-gray-500 text-lg">
                  Formulas
                </span>
              </a>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3 ">
            <button
              className='bg-blue-500 rounded-sm text-white w-8 h-8 flex items-center justify-center hover:rounded-md transition-all duriation-300'
              onClick={createFormula}
            >
              <LucidePlus size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
