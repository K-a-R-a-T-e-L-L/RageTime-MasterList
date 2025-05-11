# 🕒 RageTime | MasterList

# Веб-приложение в виде графиков онлайна игровых режимов позволяет отслеживать статистику игроков в разных временных промежутках с удобной визуализацией 📊.

![Uploading image.png…]()


## 🔥 Возможности
- Гибкая аналитика онлайна:
  - AVG — среднее количество игроков
  - MAX — пиковый онлайн
  - 1D / 7D / 30D — статистика за 1 день, неделю или месяц
- Адаптивные графики с настройкой временного диапазона
- Автообновление данных

## 🛠 Технологии
- Фронтенд:
  - React + TypeScript
  - Recharts (визуализация)
  - SCSS (стили)
  
- Бэкенд:
  - Express.js
  - Prisma ORM + MySQL (база данных)
  - Cron (автоматизация удаления данных)

## ⚙️ Установка
1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/K-a-R-a-T-e-L-L/RageTime-MasterList.git
   cd RageTime-MasterList

2. Установка зависимостей:
   ```bash
   cd client && npm install
   cd ../server && npm install

3. Настройка переменных окружения

4. Инициализация таблиц в БД:
   ```bash
   npx prisma migrate dev

5. Запуск в режиме разработки:
   ```bash
   npm run dev
   cd ../client && npm run dev

## 📞 Контакты
   ● **Телеграм** — [@K_a_R_a_T_e_L_L](https://t.me/K_a_R_a_T_e_L_L)
   
   ● **Email** — kirillcuhorukov6@gmail.com
