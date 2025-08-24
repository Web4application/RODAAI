npm install -r requirements.txt
# Step 1: Build Docker image
docker build -t roda-ai-api .

# Step 2: Run container
docker run -d -p 8000:8000 roda-ai-api

# OR using Compose
docker compose up --build

$ npm install
$ npm run dev

git clone https://github.com/Web4application/RODAAI.git
cd RODAAI

cd .env.local .env
docker-compose up --build

git clone https://github.com/Web4application/enclov-AI.git
cd enclov-AI

docker-compose up --build

npm i -g vercel
vercel login
vercel link
vercel build        # creates `.vercel/output`
vercel deploy --prebuilt  # deploys from that build

vercel env add team_bnSuCzLCbrlG4vo5dvRRaj0D
vercel env add c776CzCNUv1dDy9PADHdVmZT
# Build the image
docker build -t roda-ai-api .

# Run the container
docker run -d -p 8000:8000 roda-ai-api

az login
az webapp up --name roda-ai-app --runtime "NODE|18-lts" --sku F1

brew install xcodegen   # one-time install
xcodegen generate       # creates RodaAI.xcodeproj
open RodaAI.xcodeproj   # ready to build in Xcode

xcodebuild -project RodaAI.xcodeproj -scheme RodaAI build

bundle install
ruby wire-sources.rb

php -r "if (hash_file('sha384', 'composer-setup.php') === 'dac665fdc30fdd8ec78b38b9800061b4150413ff2e3b6f88543c636f7cd84f6db9189d43a81e5503cda447da73c7e5b6') { echo 'Installer verified'.PHP_EOL; } else { echo 'Installer corrupt'.PHP_EOL; unlink('composer-setup.php'); exit(1); }"
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"
mv composer.phar /usr/local/bin/composer

