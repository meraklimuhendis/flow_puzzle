import { Wrench, Clock, RefreshCw } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Ana Kart */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          {/* İkon Animasyonu */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-full">
                <Wrench className="w-16 h-16 text-white animate-bounce" />
              </div>
            </div>
          </div>

          {/* Başlık */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Bakımdayız! 🔧
          </h1>

          {/* Alt Başlık */}
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Daha iyi bir deneyim için sistemi geliştiriyoruz
          </p>

          {/* Bilgi Kartları */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Tahmini Süre */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl p-6">
              <div className="flex items-center justify-center mb-3">
                <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Tahmini Süre
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Kısa bir süre içinde
              </p>
            </div>

            {/* Ne Yapıyoruz */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl p-6">
              <div className="flex items-center justify-center mb-3">
                <RefreshCw className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Ne Yapıyoruz?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sistem iyileştirmeleri
              </p>
            </div>
          </div>

          {/* Mesaj */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              💡 <strong>İpucu:</strong> Sayfayı birkaç dakika sonra yenilemeyi deneyin!
            </p>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Anlayışınız için teşekkür ederiz ❤️
            </p>
          </div>
        </div>

        {/* Alt Bilgi */}
        {/* <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sorularınız için:{' '}
            <a 
              href="mailto:support@flowpuzzle.com" 
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              support@flowpuzzle.com
            </a>
          </p>
        </div> */}
      </div>
    </div>
  );
}
