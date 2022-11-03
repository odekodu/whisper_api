#! /bin/sh
set -e

if [ "$NODE_ENV" = "production" ]; then
	npm start
elif [ "$NODE_ENV" = "development" ]; then
	npm run start:dev
elif [ "$NODE_ENV" = "test" ]; then
	npm run test
fi
