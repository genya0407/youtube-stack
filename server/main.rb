require 'sinatra'
require 'sinatra/cross_origin'
enable :cross_origin
require 'json'
require 'sequel'
VIDEOS = Sequel.sqlite('development.sqlite3')[:videos]

get '/video/next' do
  cross_origin
  content_type :json

  next_video = VIDEOS.where(played_at: nil).order(:created_at).first
  if next_video.nil?
    { error: 'no videos stacked.' }.to_json
  else
    VIDEOS.where(id: next_video[:id]).update(played_at: Time.now)
    { videoId: next_video[:video_id] }.to_json
  end
end
