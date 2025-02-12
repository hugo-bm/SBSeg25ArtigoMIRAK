
routinator init --accept-arin-rpa -f  && routinator server --http 0.0.0.0:8323 --rtr 0.0.0.0:3323 --http 0.0.0.0:9556 -d

nginx -g "daemon off;"