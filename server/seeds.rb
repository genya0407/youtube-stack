require 'sequel'
DB = Sequel.sqlite('development.sqlite3')

['3y8UZylK8L0', 'NEb9MTNk3y4', 'tr-ALJS48WY', 'KYOvPZH8tpo'].each do |video_id|
  DB[:videos].insert(video_id: video_id, created_at: Time.now)
end
