FROM ghcr.io/puppeteer/puppeteer:20.7.3
ENV TEST_PAGE_URL="https://google.com"
ENV BASIC_AUTH_USERNAME=""
ENV BASIC_AUTH_PASSWORD=""

RUN npm install --force puppeteer-har && mkdir output/
COPY src/test.js .
