#!/bin/bash
set -e
DATE=$(date +%Y%m%d_%H%M%S)
echo "Backing up postgres to backup_$DATE.sql"
docker-compose exec -T db pg_dump -U omuser omjewellers > "backup_$DATE.sql"
echo "Backing up media to media_backup_$DATE.tar.gz"
tar czf "media_backup_$DATE.tar.gz" backend/media || true
echo "Done: backup_$DATE.sql + media_backup_$DATE.tar.gz"
