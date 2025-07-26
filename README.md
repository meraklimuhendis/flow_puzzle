# Flow Puzzle Game 🎮

Modern web tabanlı akış bulmacası oyunu. React.js frontend ve FastAPI backend ile geliştirilmiştir.

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Docker
- Docker Compose

### Development Ortamı

```bash
# Geliştirme ortamını başlat
docker-compose -f docker-compose.dev.yml up --build

# Veya Makefile ile
make dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Production Ortamı

```bash
# Production build
make build

# Production ortamını başlat
make up
```

## 📁 Proje Yapısı

```
flow_puzzle/
├── frontend/           # React.js frontend
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── package.json
├── backend/            # FastAPI backend
│   ├── app/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── main.py
│   └── requirements.txt
├── docker-compose.yml      # Production
├── docker-compose.dev.yml  # Development
└── Makefile
```

## 🛠️ Geliştirme Komutları

```bash
make help          # Tüm komutları görüntüle
make dev           # Development ortamını başlat
make build         # Production build
make up            # Production ortamını başlat
make down          # Tüm container'ları durdur
make logs          # Log'ları görüntüle
make clean         # Temizlik yap
```

## 🎯 Oyun Özellikleri

- [ ] İnteraktif grid sistemi
- [ ] Drag & drop ile çizgi çizme
- [ ] Çoklu seviye sistemi
- [ ] Skor ve timer
- [ ] Responsive tasarım
- [ ] Progressive Web App (PWA)

## 🔧 Teknoloji Stack

**Frontend:**
- React.js 18
- TypeScript
- HTML5 Canvas
- CSS3

**Backend:**
- FastAPI
- Python 3.11
- Uvicorn

**DevOps:**
- Docker
- Docker Compose
- Nginx (production)

## 📝 Lisans

MIT License
